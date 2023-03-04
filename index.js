const express = require("express");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routers/auth");
const getHome = require("./routers/Home_APIs/Home_GET");
const MemberManagement = require("./routers/Member_management_APIs/MemberManagement");


const app = express();
const port = 7001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Print called API path
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/home", getHome);
app.use("/api/member", MemberManagement);


app.listen(port, () => {
  console.log(`Running Express Server On PORT ${port}`);
});
