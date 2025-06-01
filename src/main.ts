import express from "express"
import path from "path";
import SequelizeStore from 'connect-session-sequelize'
import routes from "./routes";
import session from "express-session";
import sequelize, { initializeDatabase } from "./Data/Database";
import AuthRouter from "./routes/auth";
import characterRoutes from "./routes/characterRoutes";
import campainRoutes from "./routes/campainRoutes";

const app = express();
const SessionStore = SequelizeStore(session.Store);
const viewsFolder = path.join(__dirname, "../public");
const port = process.env.ROUTE_PORT || 8000;

initializeDatabase();

app.set("views", viewsFolder);
app.set("view engine", "ejs");
app.use(session({
    secret: "MyLovedAndComplexSecret8525",
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

app.listen(port, () => {
    console.log(`Initialized at http://localhost:${port}`);
});