const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  user: process.env.PUSER,
  password: process.env.PPASSWORD,
  host: process.env.PHOST,
  port: process.env.PPORT,
  database: process.env.PDATABASE,
});
const query = (text, params) => {
  return pool.query(text, params);
};
module.exports = { query };
