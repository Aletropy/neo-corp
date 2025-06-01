import { Router } from "express";
import { AuthMiddleware } from "../Middlewares/auth";
import Character from "../Data/Models/Character";
import CharacterSkills from "../Data/Models/CharacterSkills";
import { Poder } from "../Data/Models/Poder";
import Ritual from "../Data/Models/Ritual";
import Item from "../Data/Models/Items";
import Weapon from "../Data/Models/Weapon";

declare module 'express-session' {
     interface SessionData {
         user : {
            id : number;
            username : string;
            isAdmin : boolean;
         };
    }
}

const characterRoutes = Router();

characterRoutes.get("/new", AuthMiddleware, (_, res) => {
    res.render("pages/character/new");
});

characterRoutes.get("/:id", AuthMiddleware, async(req, res) => {

    const character = await Character.findByPk(parseInt(req.params.id)) as any;
    const skills = await CharacterSkills.findByPk(parseInt(req.params.id));

    if(character == null || character.get("owner") != req.session.user?.id && !req.session.user?.isAdmin)
    {
        res.redirect("/dashboard");
        return;
    }

    character["poderes"] = await Promise.all(character.poderes.map(async (id : string) => {
        const poder = await Poder.findByPk(id);
        return poder;
    }));
    character["rituais"] = await Promise.all(character.rituais.map(async (id : string) => {
        const ritual = await Ritual.findByPk(id);
        return ritual;
    }));

    res.render("pages/character/character", {
        character, characterSkills: skills,
        allPoderes: await Poder.findAll(),
        allRituais: await Ritual.findAll(),
        allItems: await Item.findAll(),
        allArmas: await Weapon.findAll()
    });
});

characterRoutes.post("/new", AuthMiddleware, async (req, res) => {
    const user = req.session.user;
    if(user == undefined) 
    {
        res.sendStatus(401)
        return;
    };

    const characterInfo = req.body;
    

    const character = await Character.create({
        owner: user.id,
        info: {
            age: characterInfo.age,
            name: characterInfo.name,
            appearenceDescription: characterInfo.appearenceDescription,
            description: characterInfo.description
        },
        nex: 5,
        poderes: [1],
        attributes: {
            agi: 1,
            for: 1,
            int: 1,
            pre: 1,
            vig: 1,
        },
        classe: characterInfo.classe
    });

    await CharacterSkills.create({
        characterId: (character.get("id") as number)
    });

    res.redirect("/dashboard");
});

characterRoutes.post("/:id/update", async (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)) {
        res.send(401)
        return;
    };

    const character = await Character.findByPk(id);

    if(character == null) {
        res.send(401)
        return;
    };

    let newCharacter : {
        attributes? : any;
        info? : any;
        nex? : any;
        classe? : any;
        poderes?: any[];
        rituais? : any[];
        itens? : any[];
        armas? : any[];
    } = {
        attributes: {},
        info: {},
        poderes: character.get("poderes") as number[],
        rituais: character.get("rituais") as number[],
        itens: character.get("itens") as number[],
        armas: character.get("armas") as number[]
    };

    let skills : any = {}

    const body = req.body;
    newCharacter.nex = body.nex;
    newCharacter.classe = body.classe;
    Object.keys(body).filter((key) => key.startsWith("attributes_")).map(key => {
        const realKey = key.replace("attributes_", "");
        newCharacter.attributes[realKey] = body[key];
    });
    Object.keys(body).filter(key => key.startsWith("info_")).map(key => {
        const realKey = key.replace("info_", "");
        newCharacter.info[realKey] = body[key];
    });
    Object.keys(body).filter(key => key.startsWith("skills_")).map(key => {
        const realKey = key.replace("skills_", "");
        skills[realKey] = body[key];
    });

    body["new_poder_ids"]?.forEach((id : any) => {
        newCharacter.poderes?.push(parseInt(id))
    });
    body["new_arma_ids"]?.forEach((id : any) => {
        newCharacter.armas?.push(parseInt(id))
    });
    body["new_ritual_ids"]?.forEach((id : any) => {
        newCharacter.rituais?.push(parseInt(id))
    });

    if(body["deleted_poder_ids"])
    {
        let oldPoderes = newCharacter.poderes!;
        let newPoderes : number[] = [];
        for(const poder of oldPoderes)
        {
            if(body["deleted_poder_ids"].includes(String(poder)))
                continue;
            newPoderes.push(poder);
        }
        newCharacter.poderes = newPoderes;
    }
    if(body["deleted_arma_ids"])
    {
        let oldArmas = newCharacter.armas!;
        let newArmas : number[] = [];
        for(const arma of oldArmas)
        {
            if(body["deleted_arma_ids"].includes(String(arma)))
                continue;
            newArmas.push(arma);
        }
        newCharacter.armas = newArmas;
    }
    if(body["deleted_ritual_ids"])
    {
        let oldRituais = newCharacter.rituais!;
        let newRituais : number[] = [];
        for(const ritual of oldRituais)
        {
            if(body["deleted_ritual_ids"].includes(String(ritual)))
                continue;
            newRituais.push(ritual);
        }
        newCharacter.rituais = newRituais;
    }

    await Character.update(newCharacter, 
        { where: { id }}
    );
    
    await CharacterSkills.update(skills, {
        where: { characterId: id }
    });

    res.redirect(`/character/${id}`);
})

characterRoutes.get("/tips", AuthMiddleware, (_, res) => {
    res.render("pages/character/tips");
});


export default characterRoutes;