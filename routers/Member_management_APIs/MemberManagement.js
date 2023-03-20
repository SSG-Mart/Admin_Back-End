const router = require("express").Router();
const con = require("../../components/Connection");

// Get all member API : http://localhost:7001/api/member
// [{ "member_id": 128, "first_name": "Ushan", "last_name": "Chamod", "user_name": "ushan", "mobile": "0716654153", "date_of_reg": "2023-03-03T18:30:00.000Z", "email": "ushanchamodbandara@gmail.com", "address_line_one": "You see hotel, Weerapura, Thambala", "district_id": 17, "image": "1677910997439-ushan.jpg", "restrict_ad": 1 }]
router.get("/", (req, res) => {
  const sql = `SELECT M_ID AS member_id, f_name AS first_name, l_name AS last_name, user_name, mobile, date_of_reg, email, address_one AS address_line_one, district_id, image, restrict_ad FROM user_data`;
  con.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

/*
Member Activation API : http://localhost:7001/api/member/activate
You need provide member_id 
    { member_id:120 }

if member is already activated, it will return "Member is already activated"
if member is not activated, it will return "Member activated successfully"
*/
router.post(
  "/activate",
  (req, res, next) => {
    const { member_id } = req.body;
    if (!member_id) {
      res.status(400).send("Member ID is required");
    } else {
      req.member_id = member_id;
      next();
    }
  },
  (req, res, next) => {
    const sql = `SELECT restrict_ad FROM user_data WHERE M_ID=${req.member_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0]) {
          if (result[0].restrict_ad == 1) {
            next();
          } else {
            res.status(400).send("Member is already activated");
          }
        } else {
          res.status(400).send("Member not found");
        }
      }
    });
  },
  (req, res, next) => {
    // Activate member
    const sql = `UPDATE user_data SET restrict_ad=0 WHERE M_ID=${req.member_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.affectedRows == 1) {
          res.status(200).send("Member activated successfully");
          res.send("Member activated successfully");
        }
      }
    });
  }
);

/*
Member Deactivation API : http://localhost:7001/api/member/deactivate
You need provide member_id 
    { member_id:120 }

if member is already deactivated, it will return "Member is already deactivated"
if member is not activated, it will return "Member deactivated successfully"
*/
router.post(
  "/deactivate",
  (req, res, next) => {
    const { member_id } = req.body;
    if (!member_id) {
      res.status(400).send("Member ID is required");
    } else {
      req.member_id = member_id;
      next();
    }
  },
  (req, res, next) => {
    const sql = `SELECT restrict_ad FROM user_data WHERE M_ID=${req.member_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0]) {
          if (result[0].restrict_ad == 0) {
            next();
          } else {
            res.status(400).send("Member is already deactivated");
          }
        } else {
          res.status(400).send("Member not found");
        }
      }
    });
  },
  (req, res, next) => {
    // Activate member
    const sql = `UPDATE user_data SET restrict_ad=1 WHERE M_ID=${req.member_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.affectedRows == 1) {
          res.status(200).send("Member deactivated successfully");
        }
      }
    });
  }
);

// Get all seller API : http://localhost:7001/api/member/seller
/*

Output :
[
    {
        "member_id": 128,
        "fist_name": "Ushan",
        "last_name": "Chamod",
        "user_name": "ushan",
        "mobile": "0716654153",
        "date_of_reg": "2023-03-03T18:30:00.000Z",
        "email": "ushanchamodbandara@gmail.com",
        "address_line_one": "You see hotel, Weerapura, Thambala",
        "district_id": 17,
        "district_name": "Kurunegala",
        "image": "1677910997439-ushan.jpg",
        "restrict_ad": 0,
        "seller_id": 57,
        "C_ID": 2,
        "store_name": "uc",
        "nic": "991581464v",
        "date_of_register": "2023-03-03T18:30:00.000Z",
        "nic_image": "1677936225471-310446575_420638993553131_8101336341958841691_n.jpg"
    }
]
 */
router.get("/seller", (req, res) => {
  const sql = `SELECT user_data.M_ID AS member_id , user_data.f_name AS fist_name, user_data.l_name AS last_name, user_data.user_name, user_data.mobile, user_data.date_of_reg, user_data.email, user_data.address_one AS address_line_one, user_data.district_id, district.name AS district_name , user_data.image, user_data.restrict_ad, seller_data.seller_id , seller_data.C_ID , seller_data.store_name , seller_data.nic , seller_data.date_of_register, seller_data.nic_image, seller_data.restrict_ad FROM user_data INNER JOIN seller_data ON user_data.M_ID = seller_data.M_ID INNER JOIN district ON user_data.district_id = district.district_id`;
  con.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// Seller Account Activate API : http://localhost:7001/api/member/seller/activate
router.post(
  "/seller/activate",
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
    const sql = `SELECT restrict_ad FROM seller_data WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0]) {
          if (result[0].restrict_ad == 1) {
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
    // Activate member
    const sql = `UPDATE seller_data SET restrict_ad=0 WHERE seller_id=${req.seller_id}`;
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
  "/seller/deactivate",
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
    const sql = `SELECT restrict_ad FROM seller_data WHERE seller_id=${req.seller_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result[0]) {
          if (result[0].restrict_ad == 0) {
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
    const sql = `UPDATE seller_data SET restrict_ad=1 WHERE seller_id=${req.seller_id}`;
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
