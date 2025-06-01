import { NextFunction, Request, Response } from "express";

export const AuthMiddleware = (req : Request, res : Response, next : NextFunction) => {
    if(req.session.user == undefined || isNaN(req.session.user.id)) {
        return res.redirect("/");
    }
    next();
}

export const AdminMiddleware = (req : Request, res : Response, next : NextFunction) => {
    if(!(req.session as any).user?.isAdmin) {
        return res.redirect("/dashboard");
    }
    next();
}