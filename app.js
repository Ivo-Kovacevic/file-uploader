require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./config/passportConfig");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(
    session({
        secret: "cats",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRouter);

app.listen(PORT, () => console.log(`App is live at port ${PORT}`));
