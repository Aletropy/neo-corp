import { Router } from "express";
import bcrypt from 'bcryptjs'
import User from "../Data/Models/User";
import { AuthMiddleware } from "../Middlewares/auth";

declare module 'express-session' {
     interface SessionData {
         user : {
            id : number;
            username : string;
            isAdmin : boolean;
         };
    }
}


const AuthRouter = Router();

AuthRouter.post('/login', async (req, res) => {

    if(!req.body.username || !req.body.password) {
        res.redirect("/logout");
        return;
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({where: { username }});
        
        if(!user || !bcrypt.compareSync(password, user.get("password") as string)) {
            res.status(401).json({ message: 'Credencias inválidas'});
            return;
        }

        req.session.user = {
            id: user.get("id") as number,
            username: user.get("username") as string,
            isAdmin: user.get("isAdmin") as boolean
        }

        res.redirect("/dashboard");
    } catch(error) {
        res.status(500).json({message: "Erro no servidor: " + error});
    }
});

AuthRouter.post("/account/changeInfo", AuthMiddleware, async (req, res) => {

    const user = await User.findByPk(req.session.user?.id);

    if(user == null)
    {
        res.redirect("/logout")
        return;
    }

    const passwordHash = user.get("password") as string;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    if(!bcrypt.compareSync(currentPassword, passwordHash))
    {
        res.send({
            error: "Senha atual inválida."
        });
        return;
    }

    if(newPassword != newPasswordConfirm)
    {
        res.send({
            error: "A nova senha e sua confirmação devem ser idênticas."
        })
        return;
    }

    user.set("password", newPassword);

    await user.save();

    res.redirect("/logout");
});

AuthRouter.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

export default AuthRouter;