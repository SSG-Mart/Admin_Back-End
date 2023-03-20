const router = require("express").Router();
const con = require("../../components/Connection");

// Get all seller they not verified by admin
router.get("/", (req, res) => {
  const sql = `
    SELECT
    seller_data.seller_id,
    seller_data.M_ID AS member_id,
    seller_data.C_ID AS category_id,
    category.name AS category_name,
    seller_data.store_name,
    seller_data.nic AS nic_number,
    seller_data.date_of_register,
    seller_data.nic_image,
    seller_data.admin_verification,
    seller_data.restrict_ad,
    user_data.M_ID,
    user_data.f_name,
    user_data.l_name,
    user_data.user_name,
    user_data.mobile,
    user_data.date_of_reg,
    user_data.email,
    user_data.address_one,
    user_data.district_id,
    district.name AS district_name,
    user_data.image
    FROM
    seller_data
    INNER JOIN user_data ON seller_data.M_ID = user_data.M_ID
    INNER JOIN district ON user_data.district_id = district.district_id
    INNER JOIN category ON seller_data.C_ID = category.C_ID
    WHERE
    seller_data.admin_verification = 0
    AND
    seller_data.restrict_ad=0
    `;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/confirm/:seller_id", (req, res) => {
  const sql = `UPDATE seller_data SET admin_verification=1 WHERE seller_id=${req.params.seller_id}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.affectedRows == 1) {
        res.status(200).send("Seller Verified");
      } else {
        res.status(500).send("Seller Not found");
      }
    }
  });
});

module.exports = router;
