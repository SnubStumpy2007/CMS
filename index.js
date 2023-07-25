const express = require('express')
const mysql = require('mysql2')

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "CMS",
})


// Connect to DB
db.connect((err) => {
    if(err) {
        throw err;
        console.log(err)
    }
})


// create DB
app.get("/createdb", (req, res) => {
    let sql = "CREATE DATABASE nodemysql"
    db.query(sql,(err) => {
        if(err){
            throw err
        } else {
            res.send("Database Created")
        }
    })
})

app.get("/employee1", (req, res) =>
{
    let post = {name: "Elize Lutus", designation: "Chief Healing Artes Officer"}
    let sql = "INSERT INTO employee SET?";
    let query = db.query(sql, post, (err) => {
        if(err){
            throw err
        } else {
            res.send("Database Created")
        }
    })
})

app.get("/updateemployee/:id", (req, res) => {

    let newName = "Updated name";
  
    let sql = `UPDATE employee SET name = '${newName}' WHERE id = ${req.params.id}`;
  
    let query = db.query(sql, (err) => {
  
      if (err) {
  
        throw err;
  
      }
  
      res.send("Post updated...");
  
    });
  
  });

  pp.get("/deleteemployee/:id", (req, res) => {

    let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
  
    let query = db.query(sql, (err) => {
  
      if (err) {
  
        throw err;
  
      }
  
      res.send("Employee deleted");
  
    });
  
  });

  app.listen("3000", () => {

    console.log("Server started on port 3000");
  
  });
  
  
  app.listen("3000", () => {
  
    console.log("Server started on port 3000");
  
  });