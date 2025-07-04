import { Router } from "express";
import { AuthMiddleware } from "../Middlewares/auth";
import Character from "../Data/Models/Character";
import CharacterSkills, { SkillName } from "../Data/Models/CharacterSkills";
import { Poder } from "../Data/Models/Poder";
import Ritual from "../Data/Models/Ritual";
import Item from "../Data/Models/Items";
import Arma from "../Data/Models/Weapon";
import DiceInterpreter, { EvaluationResult } from "../Dice/DiceInterpreter";
import SessionHandler from "../Session/SessionHandler";

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

const characterRoutes = Router();

characterRoutes.get("/new", AuthMiddleware, (_, res) => {
    res.render("pages/character/new");
});

characterRoutes.get("/:id/roll/:pericia", AuthMiddleware, async (req, res) => {

    const characterId = parseInt(req.params.id);
    const pericia = req.params.pericia;

    const character = await Character.findByPk(characterId);

    if(character == null || character.get("owner") != req.session.user?.id && !req.session.user?.isAdmin)
    {
        res.redirect("/dashboard");
        return;
    }

    const skills = await CharacterSkills.findOne({ where: {characterId: characterId }});
    if(skills == null)
    {
        res.status(404).send("Character skills not found");
        return;
    }
    const skillValue = skills.get(pericia) as number;
    const diceCount = (character.get("attributes") as any)[CharacterSkills.skillToAttributeMap[pericia as SkillName]] as number;

    let roll : EvaluationResult;

    if(skillValue == undefined || skillValue <= 0)
        roll = new DiceInterpreter().Interpret(`>[${diceCount}d20]`);
    else
        roll = new DiceInterpreter().Interpret(`>[${diceCount}d20] + ${skillValue}`);

    console.log(`Rolled for character ${(character.get("info") as any).name}: ${roll.stringValue}`)
    
    SessionHandler.PropagateRoll(req.session.user!, character, roll)

    res.status(200).json(roll);
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
    character["armas"] = await Promise.all(character.armas.map(async (id : string) => {
        const arma = await Arma.findByPk(id);
        return arma;
    }));
    character["itens"] = await Promise.all(character.itens.map(async (id : string) => {
        const item = await Item.findByPk(id);
        return item;
    }));

    res.render("pages/character/character", {
        character, characterSkills: skills,
        allPoderes: await Poder.findAll(),
        allRituais: await Ritual.findAll(),
        allItems: await Item.findAll(),
        allArmas: await Arma.findAll(),
        humanizeWeaponType: (type : any) => {
            const map = {
                "corpo_a_corpo": "Corpo-a-Corpo",
                "arremessavel": "Arremessável",
                "ranged": "À Distância",
                "fire": "Arma de Fogo"
            } as any;
            return map[type] || type;
        },
        humanizeGrip: (grip : any) => {
            const map = {
                "leve": "Leve",
                "uma_mao": "Uma Mão",
                "duas_maos": "Duas Mãos"
            } as any;
            return map[grip] || grip;
        },
        humanizeProficiency: (proficiency : any) => {
            const map = {
                "simples": "Simples",
                "tatica": "Tática",
                "pesada": "Pesada"
            } as any;
            return map[proficiency] || proficiency;
        },
        formatCritical: (chance : any, multiplier : any) => {
            if (chance && multiplier) {
                return `${chance}/${multiplier}x`;
            } else if (multiplier) {
                return `${multiplier}x`;
            }
            return "-";
        }
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

    const initialPoints = getInitialPoints(characterInfo.classe, characterInfo);

    const character = await Character.create({
        owner: user.id,
        info: {
            age: characterInfo.age,
            name: characterInfo.name,
            appearenceDescription: characterInfo.appearenceDescription,
            description: characterInfo.description,
            pessoalItems: characterInfo.pessoalItems
        },
        nex: 5,
        maxPs: initialPoints.ps,
        maxPv: initialPoints.pv,
        maxPe: initialPoints.pe,
        pv: initialPoints.pv,
        ps: initialPoints.ps,
        pe: initialPoints.pe,
        poderes: [],
        attributes: {
            agi: characterInfo.agilidade,
            for: characterInfo.forca,
            int: characterInfo.intelecto,
            pre: characterInfo.presenca,
            vig: characterInfo.vigor
        },
        classe: characterInfo.classe
    });
    try {

        await CharacterSkills.create({
            characterId: (character.get("id") as number)
        });
    } catch (error) {
        console.error("Error creating character skills:", error);
        res.status(500).send("Error creating character skills");
        return;
    }

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

    req.session.characterId = id;

    let newCharacter : {
        attributes? : any;
        info? : any;
        nex? : any;
        classe? : any;
        poderes?: any[];
        rituais? : any[];
        itens? : any[];
        armas? : any[];
        pv : number;
        ps : number;
        pe : number;
        maxPv : number;
        maxPs : number;
        maxPe : number;
    } = {
        attributes: {},
        info: {},
        poderes: character.get("poderes") as number[],
        rituais: character.get("rituais") as number[],
        itens: character.get("itens") as number[],
        armas: character.get("armas") as number[],
        pv: character.get("pv") as number,
        ps: character.get("ps") as number,
        pe: character.get("pe") as number,
        maxPv: character.get("maxPv") as number,
        maxPs: character.get("maxPs") as number,
        maxPe: character.get("maxPe") as number
    };

    let skills : any = {}

    const body = req.body;

    newCharacter.nex = body.nex;
    newCharacter.classe = body.classe;
    newCharacter.pv = parseInt(body.pv);
    newCharacter.maxPv = parseInt(body.maxPv);
    newCharacter.ps = parseInt(body.ps);
    newCharacter.maxPs = parseInt(body.maxPs);
    newCharacter.pe = parseInt(body.pe);
    newCharacter.maxPe = parseInt(body.maxPe);
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
    body["new_item_ids"]?.forEach((id : any) => {
        newCharacter.itens?.push(parseInt(id))
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
    if(body["deleted_item_ids"])
    {
        let oldItens = newCharacter.itens!;
        let newItens : number[] = [];
        for(const item of oldItens)
        {
            if(body["deleted_item_ids"].includes(String(item)))
                continue;
            newItens.push(item);
        }
        newCharacter.itens = newItens;
    }

    try {
        await Character.update(newCharacter, 
            { where: { id }}
        );
    } catch (error) {
        console.error("Error updating character:", error);
        res.status(500).send("Error updating character");
        return;
    }
    
    await CharacterSkills.update(skills, {
        where: { characterId: id }
    });

    res.redirect(`/character/${id}`);
})

characterRoutes.get("/tips", AuthMiddleware, (_, res) => {
    res.render("pages/character/tips");
});

function getInitialPoints(classe : string, attributes : any) : { ps : number, pv : number, pe : number } {
    if(classe == "combatente") {
        return { ps: 12, pv: 20 + parseInt(attributes.vigor), pe: 2 + parseInt(attributes.presenca) };
    } else if(classe == "especialista") {
        return { ps: 16, pv: 16 + parseInt(attributes.vigor), pe: 3 + parseInt(attributes.presenca) };
    } else if(classe == "ocultista") {
        return { ps: 20, pv: 12 + parseInt(attributes.vigor), pe: 4 + parseInt(attributes.presenca) };
    }

    return { ps: 0, pv: 0, pe: 0 };
}

export default characterRoutes;