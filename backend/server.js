"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const authRoutes = require("./routes/auth");

const USER_PARAMETER_ERROR = 400;
const SERVER_ERROR = 500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());


app.use("/", authRoutes);

app.use(express.static('public'));
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);