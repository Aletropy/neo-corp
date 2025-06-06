import { Router } from "express";
import { AdminMiddleware, AuthMiddleware } from "../Middlewares/auth";
import User from "../Data/Models/User";
import Campaign from "../Data/Models/Campaign";
import Character from "../Data/Models/Character";

declare module 'express-session' {
     interface SessionData {
         user : {
            id : number;
            username : string;
            isAdmin : boolean;
         };
         characterId : number;
    }
}

const activeCampaigns: { [key: number]: boolean } = {}; // Temporary storage for active campaings, forward change to an handler.

const campainRoutes = Router();

campainRoutes.get("/session/:id", AuthMiddleware, async (req, res) => {

    const campain = await Campaign.findByPk(parseInt(req.params.id));

    if(campain == null)
    {
        res.redirect("/404");
        return;
    }

    const character = await Character.findByPk(req.session.characterId);

    if(character == null || character.get("owner") != req.session.user?.id && !req.session.user?.isAdmin)
    {
        res.redirect("/dashboard");
        return;
    }

    res.render("pages/campain/session", {
        campaignName: campain.get("name"),
        campaignId: campain.get("id"),
        system: "Ordem Paranormal 1.1",
        user: req.session.user,
        character: character.get()
    });
});

campainRoutes.get("/new", AdminMiddleware, (_, res) => {
    res.render("pages/campain/new");
})

campainRoutes.post("/new", AdminMiddleware, async (req, res) => {

    const { name, description } = req.body as {
        name : string;
        description : string;
    };

    const user = req.session.user!;

    await Campaign.create({
        name: name,
        gameMaster: user.id,
        description: description,
        characters: [user.username + " - GM"],
        players: [user.id],
        progress: 0
    });

    res.redirect("/dashboard");
});

campainRoutes.post("/:id/open", async (req, res) => {

    const campaign = await Campaign.findByPk(parseInt(req.params.id));
    const user = req.session.user;

    if(campaign == null || user == null)
    {
        res.redirect("/404");
        return;
    }

    const gameMaster = campaign.get("gameMaster") as number;

    if(gameMaster != user.id && !user.isAdmin)
    {
        res.sendStatus(403);
        return;
    }

    if(activeCampaigns[campaign.get("id") as number])
    {
        res.sendStatus(400);
        return;
    }

    activeCampaigns[campaign.get("id") as number] = true;

    res.sendStatus(200);
});

campainRoutes.post("/:id/join", async (req, res) => {

    const campaign = await Campaign.findByPk(parseInt(req.params.id));
    const user = req.session.user;

    if(campaign == null || user == null)
    {
        res.redirect("/404");
        return;
    }

    const players = campaign.get("players") as number[];

    if(!players.includes(user.id) && !user.isAdmin)
    {
        res.sendStatus(403);
        return;
    }

    if(!activeCampaigns[campaign.get("id") as number])
    {
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

campainRoutes.get("/:id", AuthMiddleware, async (req, res) => {
    const campain = await Campaign.findOne({
        where: {id: parseInt(req.params.id)}
    });

    if(campain == null)
    {
        res.redirect("/404")
        return;
    }

    const gameMaster = await User.findOne({
        where: {id: campain.get("gameMaster") as number}
    });

    if(gameMaster == null)
    {
        res.send(500);
        return;
    }

    res.render("pages/campain", { campain: {
        id: req.params.id,
        name: campain.get("name"),
        description: campain.get("description"),
        active: activeCampaigns[campain.get("id") as number] || false,
        progress: campain.get("progress") as number,
        gameMaster: gameMaster.get("username"),
        gameMasterId: gameMaster.get("id"),
        system: "Ordem Paranormal 1.1",
        players: campain.get("characters")
    }, user: req.session.user });
});

export default campainRoutes;