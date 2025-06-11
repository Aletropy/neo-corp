import { Application } from "express";
import { AdminMiddleware, AuthMiddleware } from "./Middlewares/auth";
import Character from "./Data/Models/Character";
import Campaign from "./Data/Models/Campaign";
import { Poder } from "./Data/Models/Poder";
import Ritual from "./Data/Models/Ritual";
import Item from "./Data/Models/Items";
import Arma from "./Data/Models/Weapon";
import path from "path";
import { Suggestion } from "./Data/Models/Suggestion";
import { Op } from "sequelize";

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
        res.sendFile("livro_de_regras.pdf", {
            root: path.join(__dirname, "../")
        });
    });

    app.get("/404", (_, res) => res.render("pages/404"));

    app.get("/dashboard", AuthMiddleware, async (req, res) => {

        const characters = (await Character.findAll({
            where: {owner: req.session.user?.id}
        }));

        let otherCharacters : { [key: string]: any }[] = [];
        if (req.session.user?.isAdmin) {
            otherCharacters = (await Character.findAll({
                where: {
                    owner: {
                        [Op.ne]: req.session.user.id
                    }
                }
            }));
        }
        
        const campaings = (await Campaign.findAll()).flatMap(v => {
            return {
                id: v.get("id"),
                name: v.get("name"),
                progress: v.get("progress")
            }
        })

        const suggestions = await Suggestion.findAll();

        res.render("pages/dashboard", {
            user: req.session.user,
            characters,
            otherCharacters,
            campaings,
            suggestions: suggestions
        })
    });

    app.get('/data-dashboard', AdminMiddleware, async (_, res) => {

        const poderes = await Poder.findAll();
        const rituais = await Ritual.findAll();
        const itens = await Item.findAll();
        const weapons = await Arma.findAll();


        const data = {
            poderes: poderes,
            rituals: rituais,
            items: itens,
            weapons: weapons
        };
        res.render('pages/data/database', data); 
    });

    app.post("/suggestion/new", AuthMiddleware, async (req, res) => {
        const { text, type } = req.body;

        if (!text || !type) {
            res.status(400).send("Title and content are required.");
            return;
        }

        await Suggestion.create({
            authorId: req.session.user!.id,
            text: text,
            type: type
        })
        
        res.status(200).send("Suggestion submitted successfully.");
    });
}