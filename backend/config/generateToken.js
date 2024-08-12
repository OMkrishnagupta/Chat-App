const jwt = require("jsonwebtoken");
// const dotenv=require("dotenv");
// dotenv.config(); 
const generateToken = (id) => {
  return jwt.sign({ id }, "omkrishna", { expiresIn: "30d" });
};

module.exports = generateToken;
