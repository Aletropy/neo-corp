import { Router } from "express";
import { AdminMiddleware, AuthMiddleware } from "../Middlewares/auth";
import Campain from "../Data/Models/Campain";
import User from "../Data/Models/User";

declare module 'express-session' {
     interface SessionData {
         user : {
            id : number;
            username : string;
            isAdmin : boolean;
         };
    }
}

const campainRoutes = Router();

campainRoutes.get("/new", AdminMiddleware, (_, res) => {
    res.render("pages/campain/new");
})

campainRoutes.post("/new", AdminMiddleware, async (req, res) => {

    const { name, description } = req.body as {
        name : string;
        description : string;
    };

    const user = req.session.user!;

    await Campain.create({
        name: name,
        gameMaster: user.id,
        description: description,
        characters: [user.username + " - GM"],
        players: [user.id],
        progress: 0
    });

    res.redirect("/dashboard");
});

campainRoutes.get("/:id", AuthMiddleware, async (req, res) => {
    const campain = await Campain.findOne({
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
        active: false,
        progress: campain.get("progress") as number,
        gameMaster: gameMaster.get("username"),
        system: "Ordem Paranormal 1.1",
        players: campain.get("characters")
    }});
});

export default campainRoutes;