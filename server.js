const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database");
const app = express();
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "gmail",
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
      from: "'GeoResolve' <mihirvelaga21144@gmail.com>",
      to: req.body.email,
      subject: "OTP Verification",
      text: `Dear ${req.body.username} ,

Your One-Time Password (OTP) for verification is:

🔐 OTP: ${number}

This code is valid for the next 10 minutes. Please do not share this OTP with anyone.

If you did not request this code, please ignore this message.

Thank you,
GeoResolve Team`,
    });
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
app.post("/register/authority", async (req, res) => {
  const number = Math.floor(Math.random() * 999999) + 100000;
  const password = req.body.password;
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  console.log(req.body);
  try {
    const results = await db.query(
      "insert into assigntable values(lower($1),$2,lower($3),$4,$5,$6,$7,lower($8),lower($9),lower($10))",
      [
        req.body.username,
        hashed,
        req.body.email,
        number,
        req.body.phoneno,
        "authority",
        req.body.age,
        req.body.district,
        req.body.village,
        req.body.role,
      ]
    );
    transport.sendMail({
      from: "'GeoResolve' <mihirvelaga21144@gmail.com>",
      to: req.body.email,
      subject: "OTP Verification",
      text: `Dear ${req.body.username} ,

Your One-Time Password (OTP) for verification is:

🔐 OTP: ${number}

This code is valid for the next 10 minutes. Please do not share this OTP with anyone.

If you did not request this code, please ignore this message.

Thank you,
GeoResolve Team`,
    });
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
app.post("/otp", async (req, res) => {
  try {
    const otp = req.body.otp;
    console.log(req.body);
    const username = req.body.username;
    const results = await db.query(
      "select * from assigntable where username=lower($1)",
      [username]
    );
    const resultsRows = results.rows[0];
    const otpdb = results.rows[0].otp;
    if (otp === otpdb) {
      await db.query('insert into lower($1) values(lower($2),$3,lower($4),$5,$6,$7,$8)', [resultsRows.tableassign, resultsRows.username, resultsRows.password, resultsRows.email, resultsRows.phoneno, resultsRows.age, resultsRows.district, resultsRows.village]);
      await db.query('delete otp from assigntable where username=lower($1)', [req.body.username]);
      res.status(200).send({
        message: "login successful",
        status: "ok",
      });
    }
  } catch (err) {
    const message = err.message || "Internal Server Error";
    const status = err.statusCode || 500;
    res.status(status).send({
      message: message,
      status: "error",
    });
  }
});
app.listen(port, () => {
  console.log(`Server up and listening on ${port}`);
});
