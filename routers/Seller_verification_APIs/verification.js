const router = require("express").Router();
const con = require("../../components/Connection");

// Get all seller they not verified by admin
router.get("/not-verify", (req, res) => {
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
    seller_data.verify_seller,
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
    seller_data.verify_seller = 0
    `;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send("Internal Server Error");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/verify/:seller_id", (req, res) => {

  const { seller_id } = req.params;

  if(!seller_id) return res.send("Seller ID is required")
  console.log(seller_id);
  const sql = `UPDATE seller_data SET verify_seller=1 WHERE seller_id=${seller_id}`;
  
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



router.get("/", (req, res) => {
  const sql = `SELECT user_data.M_ID AS member_id , user_data.f_name AS fist_name, user_data.l_name AS last_name, user_data.user_name, user_data.mobile, user_data.date_of_reg, user_data.email, user_data.address_one AS address_line_one, user_data.district_id, district.name AS district_name , user_data.image, seller_data.seller_id , seller_data.C_ID , seller_data.store_name , seller_data.nic , seller_data.date_of_register, seller_data.nic_image, seller_data.verify_seller, seller_data.activation_state
  FROM seller_data INNER JOIN user_data ON seller_data.M_ID = user_data.M_ID INNER JOIN district ON user_data.district_id = district.district_id`;
  con.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if(!id) return res.send("Seller ID is required");

  const sql = `SELECT user_data.M_ID AS member_id , user_data.f_name AS fist_name, user_data.l_name AS last_name, user_data.user_name, user_data.mobile, user_data.date_of_reg, user_data.email, user_data.address_one AS address_line_one, user_data.district_id, district.name AS district_name , user_data.image, seller_data.seller_id , seller_data.C_ID , seller_data.store_name , seller_data.nic , seller_data.date_of_register, seller_data.nic_image, seller_data.verify_seller, seller_data.activation_state
  FROM seller_data INNER JOIN user_data ON seller_data.M_ID = user_data.M_ID INNER JOIN district ON user_data.district_id = district.district_id`;
  
  con.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result?.[0]);
    }
  });
});

// Seller Account Activate API : http://localhost:7001/api/member/seller/activate
router.post("/activate",
  (req, res, next) => {
    const { seller_id } = req.body;
    if (!seller_id) {
      res.status(400).send("seller_id is required");
    } else {
      req.seller_id = seller_id;
      next();
    }
  },
  (req, res, next) => {
    const sql = `SELECT activation_state FROM seller_data WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0]) {
          if (result[0].activation_state == 0) {
            next();
          } else {
            res.status(400).send("Member is already activated");
          }
        } else {
          res.status(400).send("Seller not found");
        }
      }
    });
  },
  (req, res, next) => {
    // Activate SELLER
    const sql = `UPDATE seller_data SET activation_state=1 WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.affectedRows == 1) {
          res.send("Seller activated successfully");
        }
      }
    });
  }
);

// Seller Account Deactivate API : http://localhost:7001/api/member/seller/deactivate
router.post(
  "/deactivate",
  (req, res, next) => {
    const { seller_id } = req.body;
    if (!seller_id) {
      res.status(400).send("seller_id is required");
    } else {
      req.seller_id = seller_id;
      next();
    }
  },
  (req, res, next) => {
    const sql = `SELECT activation_state FROM seller_data WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result[0]) {
          if (result[0].activation_state == 1) {
            next();
          } else {
            res.status(400).send("Seller is already deactivated");
          }
        } else {
          res.status(400).send("Seller not found");
        }
      }
    });
  },
  (req, res, next) => {
    // Activate member
    const sql = `UPDATE seller_data SET activation_state=0 WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.affectedRows == 1) {
          res.send("Seller deactivated successfully");
        }
      }
    });
  }
);


module.exports = router;
