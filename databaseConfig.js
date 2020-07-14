const mysql = require("mysql");
const { join } = require("lodash");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "br",
});

function findBusinessByID(id, callback) {
  let sql = "SELECT * from company where cid='" + id + "'";
  con.query(sql, function (err, data) {
    if (err) throw err;
    console.log(data);
    return callback(data);
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
      let res =[];
      res.push(data)
      console.log(res)
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


module.exports = {
  con,
  findBusinessByID,
  findAllBusinessByCategory,
  findCategoryByName,
};
