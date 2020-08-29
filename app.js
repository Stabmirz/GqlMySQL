const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const md5 = require("md5");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

const db = require("./databaseConfig");

const app = express();
app.use(cors());

const credentials = {
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/br.softwarefactoryexperts.com/fullchain.pem"
  ),
  key: fs.readFileSync(
    "/etc/letsencrypt/live/br.softwarefactoryexperts.com/privkey.pem"
  ),
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(4001, () => {
  console.log("App listening on port 4001 for HTTP Server");
});

httpsServer.listen(4000, () => {
  console.log("App listening on port 4000 for HTTPS Server");
});

// bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// upload company logo using

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./logos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/upload/:id", upload.single("file"), (req, res) => {
  let cid = req.params.id;
  let logo = req.file.filename;
  //update logo in database
  db.updateLogo(cid, logo);
  res.json({ file: req.file });
});

app.get("/:id", (req, res) => {
  let logo = req.params.id;
  res.sendFile(path.join(__dirname, "./logos/" + logo));
});

app.post("/send/:email/:id", (req, res) => {
  let loginid = req.params.id;
  let email = req.params.email;
  let memail = md5(email);
  let mdid = md5(loginid);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "businessrateadm@gmail.com",
      pass: "yellowelephant",
    },
  });

  var mailOptions = {
    from: "businessrateadm@gmail.com",
    to: email,
    subject: "Verify your account",
    text:
      "Please click on the link bellow to verify your account " +
      "\n" +
      "https://br.softwarefactoryexperts.com/validate/" +
      memail +
      mdid +
      memail +
      "&user=" +
      memail +
      "&linid=" +
      mdid +
      memail +
      "/" +
      loginid +
      "/" +
      mdid +
      memail,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
