const router = require("express").Router();
const con = require("../components/Connection");




// get all seller and buyers
// {
//     "FoodCount": 0,
//     "SolidCount": 1,
//     "MemberCount": 2,
//     "SellerCount": 1
// }
router.post("/", (req, res) => {
  let FoodCount = 0;
  let SolidCount = 0;
  let SellerCount = 0;
  let MemberCount = 0;

  // get Item details
  const sql = `SELECT * FROM items WHERE R_admin_id =1`;
  con.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const today = new Date();

      result.forEach((element) => {
        if (new Date(element.expire_date) > today) {
          if (element.C_ID === 1) {
            SolidCount++;
          } else if (element.C_ID === 2) {
            FoodCount++;
          }
        }
      });

      // get all members
      const sql2 = `SELECT * FROM user_data`;
      con.query(sql2, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          MemberCount = result.length;
        }

        const sql3 = `SELECT * FROM seller_data`;
        con.query(sql3, (err, result) => {
          if (err) {
            res.send(err);
          } else {
            SellerCount = result.length;
          }

          res.send({
            FoodCount: FoodCount,
            SolidCount: SolidCount,
            MemberCount: MemberCount,
            SellerCount: SellerCount,
          });
        });
      });
    }
  });
});

module.exports = router;
