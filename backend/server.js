"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const USER_PARAMETER_ERROR = 400;
const SERVER_ERROR = 500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());


/**
 * Return all user's infomation
 */
app.get("/all", async (req, res) => {
  try {

    let db = await getDBConnection();

    // select all users from user table
    let results = await db.all("SELECT * FROM user");
    if (results.length > 0) {
      let returnResults = {
        "user": results
      };
      await db.close();
      res.json(returnResults);

    // no users in database
    } else {
      await db.close();
      res.status(SERVER_ERROR).type('text')
        .send('No users are in database. Please try again');
    }
  } catch (err) {
    res.status(SERVER_ERROR).type("text")
      .send("Something is wrong with server. Please try again");
  }
});

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'example.db', // THIS IS NOT THE TABLE NAME
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);