require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const methodOverride = require("method-override");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("./config/passportConfig");
const path = require("path");
const flash = require("connect-flash");
const indexRouter = require("./routes/indexRouter");
const driveRouter = require("./routes/driveRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
    methodOverride((req, res) => {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
            const method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);
app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: "a santa at nasa",
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(new PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.currentUrl = req.originalUrl;
    next();
});

app.use("/drive", driveRouter);
app.use("/", indexRouter);

app.listen(PORT, () => console.log(`App is live at port ${PORT}`));
