const mysql = require("mysql");
const { join } = require("lodash");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "br",
});

function addBusiness(
  name,
  fname,
  lname,
  address1,
  address2,
  city,
  lat,
  lon,
  zip,
  categoryid,
  descr,
  website,
  phone,
  logo,
  loginid,
  suggested,
  favorite,
  approved
) {
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO `company` (`name`, `fname`, `lname`, `address1`, `address2`, `city`, `lat`,`lon`, `zip`, `categoryid`, `descr`, `website`, `phone`, `logo`,`loginid`, `suggested`,`favorite`,`approved`) VALUES ('" +
      name +
      "', '" +
      fname +
      "', '" +
      lname +
      "', '" +
      address1 +
      "', '" +
      address2 +
      "', '" +
      city +
      "', '" +
      lat +
      "', '" +
      lon +
      "', '" +
      zip +
      "', '" +
      categoryid +
      "', '" +
      descr +
      "', '" +
      website +
      "', '" +
      phone +
      "', '" +
      logo +
      "', '" +
      loginid +
      "', '" +
      suggested +
      "', '" +
      favorite +
      "', '" +
      approved +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let id = result.insertId;
      let nsql =
        "select * from company LastInsertedRow where cid = (select last_insert_id())";

      let insert =
        "INSERT INTO `hours` (`cid`, `monstart`, `monend`, `tuestart`, `tueend`, `wedstart`, `wedend`, `thustart`, `thuend`, `fristart`, `friend`, `satstart`, `satend`, `sunstart`, `sunend`) VALUES ('" +
        id +
        "', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00');";
      con.query(insert, function (err, data) {
        if (err) throw err;
      });
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function updateBusinessHours(
  cid,
  monstart,
  monend,
  tuestart,
  tueend,
  wedstart,
  wedend,
  thustart,
  thuend,
  fristart,
  friend,
  satstart,
  satend,
  sunstart,
  sunend
) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `hours` SET  `monstart`= '" +
      monstart +
      "', `monend` = '" +
      monend +
      "', `tuestart`= '" +
      tuestart +
      "', `tueend`= '" +
      tueend +
      "', `wedstart`= '" +
      wedstart +
      "', `wedend`= '" +
      wedend +
      "', `thustart`= '" +
      thustart +
      "', `thuend`= '" +
      thuend +
      "', `fristart`= '" +
      fristart +
      "', `friend`= '" +
      friend +
      "', `satstart`= '" +
      satstart +
      "', `satend`= '" +
      satend +
      "', `sunstart`= '" +
      sunstart +
      "',`sunend`= '" +
      sunend +
      "' where `cid` ='" +
      cid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from hours where cid = '" + cid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function updateLogo(cid, logo) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `company` SET  `logo`= '" +
      logo +
      "' where `cid` ='" +
      cid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
    });
  });
}

function updateCity(cid, city, lat, lon) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `company` SET  `city`= '" +
      city +
      "', `lat`= '" +
      lat +
      "', `lon`= '" +
      lon +
      "' where `cid` ='" +
      cid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from company where cid = '" + cid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function updateReview(rid, active) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `reviews` SET  `active`= '" +
      active +
      "' where `rid` ='" +
      rid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from reviews where rid = '" + rid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function validateAccount(loginid, active) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `loginData` SET  `active`= '" +
      active +
      "' where `loginid` ='" +
      loginid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from loginData where loginid = '" + loginid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function updateBusiness(
  cid,
  name,
  fname,
  lname,
  address1,
  address2,
  zip,
  categoryid,
  descr,
  website,
  phone,
  suggested,
  favorite,
  approved
) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `company` SET  `name`= '" +
      name +
      "', `fname` = '" +
      fname +
      "', `lname`= '" +
      lname +
      "', `address1`= '" +
      address1 +
      "', `address2`= '" +
      address2 +
      "', `zip`= '" +
      zip +
      "', `categoryid`= '" +
      categoryid +
      "', `descr`= '" +
      descr +
      "', `website`= '" +
      website +
      "', `phone`= '" +
      phone +
      "', `suggested`= '" +
      suggested +
      "',`favorite`= '" +
      favorite +
      "',`approved`= '" +
      approved +
      "' where `cid` ='" +
      cid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from company where cid = '" + cid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function updateReviewerLocation(loginid, city, state) {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE `reviewer` SET  `city`= '" +
      city +
      "', `state`= '" +
      state +
      "' where `loginid` ='" +
      loginid +
      "' ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql = "select * from reviewer where loginid = '" + loginid + "'";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function addUser(email, password, type, fname, lname, active) {
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO `loginData` (`email`, `password`, `type`, `fname`, `lname`, `active`) VALUES ('" +
      email +
      "', '" +
      password +
      "', '" +
      type +
      "', '" +
      fname +
      "', '" +
      lname +
      "', '" +
      active +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql =
        "select * from loginData LastInsertedRow where loginid = (select last_insert_id())";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function addReviewer(fname, lname, loginid) {
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO `reviewer` (`fname`, `lname`, `loginid`) VALUES ('" +
      fname +
      "', '" +
      lname +
      "', '" +
      loginid +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql =
        "select * from reviewer LastInsertedRow where reviewerid = (select last_insert_id())";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function addReview(
  cid,
  reviewerid,
  quality,
  value,
  timeliness,
  experience,
  satisfaction,
  overall,
  comments,
  fname,
  lname,
  email,
  active
) {
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO `reviews` (`cid`,`reviewerid`, `quality`, `value`, `timeliness`, `experience`, `satisfaction`, `overall`, `comments`, `fname`, `lname`, `email`, `active`) VALUES ('" +
      cid +
      "', '" +
      reviewerid +
      "', '" +
      quality +
      "', '" +
      value +
      "', '" +
      timeliness +
      "', '" +
      experience +
      "', '" +
      satisfaction +
      "', '" +
      overall +
      "', '" +
      comments +
      "', '" +
      fname +
      "', '" +
      lname +
      "', '" +
      email +
      "', '" +
      active +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql =
        "select * from reviews LastInsertedRow where rid = (select last_insert_id())";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function addReply(rid, comment, active) {
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO `reply` (`rid`,`comment`, `active`) VALUES ('" +
      rid +
      "', '" +
      comment +
      "', '" +
      active +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      let nsql =
        "select * from reply LastInsertedRow where id = (select last_insert_id())";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  });
}

function findBusinessByLoginId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from company where loginid='" + id + "'";
    con.query(sql, function (err, data) {
      resolve(data);
    });
  });
}

function findAllCompanys() {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from company";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findAllApprovedCompanys(latitude, longitude) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT cid as value, name, city, concat(name,', ',city, ', ', zip) as label, SQRT( POW(69.1 * (lat - " +
      latitude +
      " ), 2) + POW(69.1 * (" +
      longitude +
      " - lon) * COS(lat / 57.3), 2)) AS distance FROM company where approved = 1 HAVING distance < 100 ORDER BY label ASC";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findAllCategories() {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT catid as value, short_name as label from category where active = 1 ORDER BY label ASC";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findUserByEmail(email, password) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT * from loginData where email='" +
      email +
      "' and password = '" +
      password +
      "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from loginData where email='" + email + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findOwnerByLoginId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from loginData where loginid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findReviewerByLoginId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from reviewer where loginid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findBusinessByID(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from company where cid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findAllBusinessByCategory(id, latitude, longitude) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT *, @rank:=@rank+1 AS rank, SQRT( POW(69.1 * (lat - " + latitude + " ), 2) + POW(69.1 * (" + longitude + " - lon) * COS(lat / 57.3), 2)) AS distance FROM company, (SELECT @rank:=0) AS t where categoryid='" + id + "' && approved = 1 HAVING distance < 100  ORDER BY favorite DESC, distance";
    con.query(sql, function (err, data) {
      if (err) throw err;
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findCategoryByName(short_name) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from category where short_name='" + short_name + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findCategoryByCatId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from category where catid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findHoursById(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from hours where cid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findRatingsById(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from ratings where cid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

function findReview(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(time, '%M %d %Y') as date from reviews where rid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      resolve(data);
    });
  });
}

function findReply(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(time, '%M %d %Y') as date from reply where rid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      resolve(data);
    });
  });
}

function findReviewsById(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(time, '%M %d %Y') as date from reviews where cid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findExtReviewsById(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(lastretrieved, '%M %d %Y') as date from reviewsExt where cid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}


function findReviewSourceByRSI(rsi) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from reviewSource where id='" + rsi + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}


function findReviewsByReviewerId(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(time, '%M %d %Y') as date from reviews where reviewerid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      resolve(res);
    });
  });
}

function findReviewerByReviewId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from reviewer where reviewerid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

module.exports = {
  addUser,
  addReviewer,
  addReview,
  addReply,
  addBusiness,
  updateBusiness,
  updateLogo,
  updateBusinessHours,
  updateReviewerLocation,
  checkEmail,
  updateReview,
  validateAccount,
  updateCity,
  findAllCategories,
  findReview,
  findReply,
  findUserByEmail,
  findBusinessByID,
  findOwnerByLoginId,
  findReviewerByLoginId,
  findBusinessByLoginId,
  findAllBusinessByCategory,
  findCategoryByName,
  findHoursById,
  findRatingsById,
  findReviewsById,
  findReviewsByReviewerId,
  findReviewerByReviewId,
  findAllApprovedCompanys,
  findAllCompanys,
  findCategoryByCatId,
  findExtReviewsById,
  findReviewSourceByRSI
};
