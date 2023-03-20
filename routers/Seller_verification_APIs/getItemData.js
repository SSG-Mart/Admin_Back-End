const router = require("express").Router();
const con = require("../../components/Connection");

router.get("/:sellerId", (req, res) => {
    const sql = `SELECT * FROM items WHERE seller_id = ${req.params.sellerId}`;
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).send(result);
        }
    });
});


module.exports = router;
