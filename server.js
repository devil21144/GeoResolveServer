const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database");
const app = express();
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: "gmail",
  auth: {
    user: "mihirvelaga21144@gmail.com",
    pass: "uhve eoca sagb itfw",
  },
});
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
app.post("/register/citizen", async (req, res) => {
  const number = Math.floor(Math.random() * 999999) + 100000;
  const password = req.body.password;
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  console.log(req.body);
  try {
    const results = await db.query(
      "insert into assigntable values(lower($1),$2,lower($3),$4,$5,$6,$7)",
      [
        req.body.username,
        hashed,
        req.body.email,
        number,
        req.body.phoneno,
        "citizen",
        req.body.age,
      ]
    );
    transport.sendMail({
      
    })
    res.status(200).send({
      message: "successful",
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    console.log(err.statusCode);
    const status = err.statusCode || 500;
    res.status(status).send({
      message: err.message,
      status: "error",
    });
  }
});
app.listen(port, () => {
  console.log(`Server up and listening on ${port}`);
});
