const router = require("express").Router();
const con = require("../../components/Connection");


// [{ "foodCount": 0, "solidCount": 1, "memberCount": 1, "sellerCount": 1 }]
router.get("/",(req, res, next) => {
    const sql = `SELECT * FROM items WHERE R_admin_id="1"`;
    con.query(sql, async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        //  Counting Items
        const today = new Date();
        // GET ITEM solid
        const solidCount = new Promise((resolve, reject) => {
          const x = result.filter((element) => {
            return (
              new Date(element.expire_date) > today &&
              element.R_admin_id == 1 &&
              element.C_ID == 1
            );
          });
          resolve(x.length);
        });

        solidCount.then((value) => {
          req.solidCount = value;

          // GET ITEM food
          const foodCount = new Promise((resolve, reject) => {
            const y = result.filter((element) => {
              return (
                new Date(element.expire_date) > today &&
                element.R_admin_id == 1 &&
                element.C_ID == 2
              );
            });
            resolve(y.length);
          });
          foodCount.then((value2) => {
            req.foodCount = value2;
            next();
          });
        });
      }
    });
  },
  (req, res, next) => {
    // user count
    const sql_user = `SELECT * FROM user_data WHERE restrict_ad="0"`;
    con.query(sql_user, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        req.userCount = result.length;
        next();
      }
    });
  },
  (req, res, next) => {
    // Seller Count
    sql_seller = `SELECT * FROM seller_data WHERE restrict_ad="0"`;
    con.query(sql_seller, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        req.sellerCount = result.length;
        next();
      }
    });
  },
  (req, res) => {
    res.send({
      foodCount: req.foodCount,
      solidCount: req.solidCount,
      memberCount: req.userCount,
      sellerCount: req.sellerCount,
    });
  }
);

module.exports = router;
