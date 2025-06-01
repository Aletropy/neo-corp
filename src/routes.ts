import { Application } from "express";
import { AdminMiddleware, AuthMiddleware } from "./Middlewares/auth";
import Character from "./Data/Models/Character";
import Campain from "./Data/Models/Campain";
import { Poder } from "./Data/Models/Poder";
import Ritual from "./Data/Models/Ritual";
import Item from "./Data/Models/Items";
import Weapon from "./Data/Models/Weapon";

declare module 'express-session' {
     interface SessionData {
         user : {
            id : number;
            username : string;
            isAdmin : boolean;
         };
    }
}

export default (app : Application) => 
{
    app.get("/", (req, res) => 
    {
        if(!req.session.user)
            res.render("index")
        else
            res.redirect("/dashboard")
    });

    app.get("/regras", AuthMiddleware, (_, res) => {
        res.sendFile("/home/aletropy/Projects/RpgOverview/livro_de_regras.pdf");
    });

    app.get("/404", (_, res) => res.render("pages/404"));

    app.get("/dashboard", AuthMiddleware, async (req, res) => {

        const characters = (await Character.findAll({
            where: {owner: req.session.user?.id}
        })).flatMap((v) => {
            return {
                id: v.get("id"),
                nex: v.get("nex"),
                info: v.get("info"),
                classe: v.get("classe"),
                currentCampain: v.get("currentCampain")
            }
        });
        
        const campaings = (await Campain.findAll()).flatMap(v => {
            return {
                id: v.get("id"),
                name: v.get("name"),
                progress: v.get("progress")
            }
        })

        res.render("pages/dashboard", {
            user: req.session.user,
            characters,
            campaings
        })
    });

    app.get('/data-dashboard', AdminMiddleware, async (_, res) => {

        const poderes = await Poder.findAll();
        const rituais = await Ritual.findAll();
        const itens = await Item.findAll();
        const weapons = await Weapon.findAll();

        const data = {
            poderes: poderes,
            rituals: rituais,
            items: itens,
            weapons: weapons
        };
        res.render('pages/data/database', data); 
    });
}