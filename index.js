const express = require('express')
const mysql = require('mysql2')
const figlet = require('figlet')
const cTable = require('console.table');

const connection = require('db')


const app = express()




// ----------VIEW------------

figlet("Welcome to the CMS!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
const viewAllDepartments = () => {
  return connection.promise().query('SELECT * FROM department');
};

const addDepartment = () => {
  return connection.promise().query('INSERT INTO department (name) VALUES (?)', [departmentName]);
}

const viewRoles = () => {
  return connection.promise().query('SELECT * FROM department');
};

const viewEmployees = () => {
  return connection.promise().query('INSERT INTO department (name) VALUES (?)', [departmentName]);
}

  startapp();