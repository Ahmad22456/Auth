const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = require("./userSchema");
const cookieParser = require('cookie-parser')
const {createToken, verifyToken} = require('./JWT')

const app = express();
app.listen(3000);
console.log("Connected to Server");
mongoose
  .connect("mongodb://127.0.0.1:27017/Users")
  .then(() => console.log("Connected to Database"))
  .catch((e) => console.error({ error: e }));

app.use(express.json());
app.use(cookieParser())

app.post("/register", function (req, res) {
  const { username, pass } = req.body;                                           //=======>
  bcrypt
    .hash(pass, 10)
    .then((hashedPassword) =>
      userSchema
        .create({ username: username, pass: hashedPassword })
        .then(() => {
          res.json("User Registered");
        })
        .catch((err) => {
          if (err) {
            res.status(500).json({ error: err });
          }
        })
    )
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: err });
      }
    });                                                                           //=======>
});

app.post("/login", async function (req, res) {
  const { username, pass } = req.body;
  const user = await userSchema.findOne({ username });
  console.log(user);
  if (!user) {
    return res.status(400).json("User not Found");
  }
  const passCheck = await bcrypt.compare(pass, user.pass)
  console.log(passCheck)
  if(!passCheck){
    return res.status(400).json('Wrong Password')
  }
  const accessToken = createToken(user, res)
//   res.cookie('accessToken', accessToken)
  res.json("User Logged in");
});

app.get("/profile", verifyToken, function (req, res) {
  res.json("Profile...");
});
