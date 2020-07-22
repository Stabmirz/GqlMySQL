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
  state,
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
      "INSERT INTO `company` (`name`, `fname`, `lname`, `address1`, `address2`, `city`, `state`, `zip`, `categoryid`, `descr`, `website`, `phone`, `logo`,`loginid`, `suggested`,`favorite`,`approved`) VALUES ('" +
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
      state +
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
      let nsql =
        "select * from company LastInsertedRow where cid = (select last_insert_id())";
      con.query(nsql, function (err, data) {
        if (err) throw err;
        console.log(data);
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
  city,
  state,
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
      "', `city`= '" +
      city +
      "', `state`= '" +
      state +
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
        console.log(data);
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
  console.log("jgjsdgcjwjds");
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
        console.log(data);
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

function findAllBusinessByCategory(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from company where categoryid='" + id + "'";
    con.query(sql, function (err, data) {
      if (err) throw err;
      let res = [];
      res.push(data);
      console.log(res);
      resolve(res);
    });
  });
}

function findCategoryByName(name) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from category where name='" + name + "'";
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

function findReviewsById(id) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT *, DATE_FORMAT(time, '%M %d %Y') as date from reviews where cid='" +
      id +
      "'";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      console.log(res);
      resolve(res);
    });
  });
}

function findReviewsByReviewerId(id) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from reviews where reviewerid='" + id + "'";
    con.query(sql, function (err, data) {
      let res = [];
      res.push(data);
      console.log(res);
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
  addBusiness,
  updateBusiness,
  checkEmail,
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
  findAllCompanys,
  findCategoryByCatId,
};
