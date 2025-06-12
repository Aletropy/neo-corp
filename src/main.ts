import express from "express"
import path from "path";
import SequelizeStore from 'connect-session-sequelize'
import routes from "./routes";
import session from "express-session";
import sequelize, { initializeDatabase } from "./Data/Database";
import AuthRouter from "./routes/auth";
import characterRoutes from "./routes/characterRoutes";
import campainRoutes from "./routes/campaignRoutes";
import Config from "./Core/Config";
import * as http from "http";
import * as https from "https";
import { Server } from "socket.io";
import SessionHandler from "./Session/SessionHandler";
import { readFileSync } from "fs";

const options = {
    key: readFileSync(Config.SSL_KEY),
    cert: readFileSync(Config.SSL_CERT),
}

const app = express();
const server = https.createServer(options, app);
const io = new Server(server);
const SessionStore = SequelizeStore(session.Store);
const viewsFolder = path.join(__dirname, "../public");

initializeDatabase();

app.set("views", viewsFolder);
app.set("view engine", "ejs");
app.use(session({
    secret: Config.SECRET,
    store: new SessionStore({db: sequelize}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production'
    }
}))
app.use(express.static(viewsFolder));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(AuthRouter);
app.use("/character", characterRoutes);
app.use("/campain", campainRoutes);
routes(app);

SessionHandler.initialize(io);

http.createServer(function (req, res) {
    res.writeHead(301, {Location: `https://${req.headers["host"]}${req.url}`});
    res.end();
}).listen(Config.HTTP_PORT);

server.listen(Config.HTTPS_PORT, () => {
    console.log(`Initialized at https://${Config.EXPRESS_IP}:${Config.HTTPS_PORT}`);
});