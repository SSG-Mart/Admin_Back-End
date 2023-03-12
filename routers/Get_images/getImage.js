const express = require("express");
const router = express.Router();
const con = require("../../components/Connection");
const axios = require("axios");

router.get("/nic/:id", async (req, res) => {
    axios.get(`http://localhost:8080/api/img/nic/${req.params.id}`,{responseType: 'arraybuffer'})
    .then((response) => {
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
        });
        res.end(response.data);
    }
    ).catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
    });

});

module.exports = router;
