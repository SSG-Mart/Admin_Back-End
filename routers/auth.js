const { Router } = require("express");
const con = require("../components/Connection");
const router = Router();
const path = require("path");
var cors = require("cors");
const multer = require("multer");

// yftyf
// router.use(cors());

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT email, name FROM admin WHERE email = '${email}' AND password = '${password}'`;
    
    con.query(sql, (err, result) => {

        if (err) res.send('login fail')

        if (result.length > 0) {

            req.session.user = result[0];

            res.status(200).send(result[0]);

        } else {

            res.status(401).send("Email or password is incorrect");

        }
    })
})

router.get('/check-auth', async(req, res) => {
    const {user} = req.session;

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(401).send("Unauthorized");
    }
})


module.exports = router;
