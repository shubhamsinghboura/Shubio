const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

 
const chatRoute = require('./routes/chatRoutes');
app.use('/api', chatRoute);
module.exports = app;