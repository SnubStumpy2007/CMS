const express = require('express')
const mysql = require('mysql2')
const figlet = require('figlet')
const cTable = require('console.table');

// const chalk = require('chalk');

const connection = require('db');
const comms = require('./config/connection')
const { default: inquirer } = require('inquirer');


const app = express()


const prompt = () => {
  inquirer.prompt({
    name: 'choice',
    type: 'list',
    message: 'Select an option',
    choices: [
      'View All Employees',
      'View All Roles',
      'View All Departments',
      'View All Employees By Department',
      'View Department Budgets',
      'Update Employee Role',
      'Update Employee Manager',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Remove Employee',
      'Remove Role',
      'Remove Department',
      'Exit'
    ]
  })
  .then((answers) => {
    const {choices} = answers;
    if (choices === 'View All Employees') {
      viewAllEmployees();
  }

  if (choices === 'View All Departments') {
    viewAllDepartments();
  }

  if (choices === 'View All Employees By Department') {
      viewEmployeesByDepartment();
  }

  if (choices === 'Add Employee') {
      addEmployee();
  }

  if (choices === 'Remove Employee') {
      removeEmployee();
  }

  if (choices === 'Update Employee Role') {
      updateEmployeeRole();
  }

  if (choices === 'Update Employee Manager') {
      updateEmployeeManager();
  }

  if (choices === 'View All Roles') {
      viewAllRoles();
  }

  if (choices === 'Add Role') {
      addRole();
  }

  if (choices === 'Remove Role') {
      removeRole();
  }

  if (choices === 'Add Department') {
      addDepartment();
  }

  if (choices === 'View Department Budgets') {
      viewDepartmentBudget();
  }

  if (choices === 'Remove Department') {
      removeDepartment();
  }

  if (choices === 'Exit') {
      connection.end();
  }
  })
}




// ----------VIEW------------

figlet("Welcome to the CMS!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

const viewAllEmployees = () => {
  let sqlConnection =  `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.department_name AS 'department', 
  role.salary
  FROM employee, role, department 
  WHERE department.id = role.department_id 
  AND role.id = employee.role_id
  ORDER BY employee.id ASC`;
}

const viewAllDepartments = () => {
  return connection.promise().query('SELECT * FROM department');
};

const viewAllRoles = () => {
  return connection.promise().query('SELECT * FROM role')
}

const viewEmployeesByDepartment = () => {
  return connection.promise().query(`
    SELECT e.id, e.first_name, e.last_name, e.role_id, d.name AS department_name
    FROM employee e
    JOIN department d ON e.department_id = d.id
  `);
}

const addEmployee = (firstName, lastName, roleId, departmentId) => {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, department_id)'
  const values = [firstName, lastName, roleId, departmentId]
  return connection.promise().query(sql, values)
}

const removeEmployee = (firstName, lastName, roleId, departmentId) =>{
  const sql = 'DELETE FROM employee (first_name, last_name, role_id, department_id)'
  const values = [firstName, lastName, roleId, departmentId]
  return connection.promise().query(sql, values)
}

const updateEmployeeRole = (firstName, lastName, roleId, departmentId) => {
  const sql = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  const values = [firstName, lastName, roleId, departmentId]
  return connection.promise().query(sql, values)
}

const updateEmployeeManager = (firstName, lastName, roleId, departmentId, managerId) => {
  const sql = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  const values = [firstName, lastName, roleId, departmentId, managerId]
  return connection.promise().query(sql, values)
}

const addRole = (title, salary, departmentId) => {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const values = [title, salary, departmentId];
  return connection.promise().query(sql, values);
};


const removeRole = (roleId) => {
  const sql = 'DELETE FROM role WHERE id = ?';
  const values = [roleId];
  return connection.promise().query(sql, values);
};


const addDepartment = (departmentId) => {
  const sql = 'UPDATE WHERE department_id WHERE id = ?'
  const values = [departmentId]
  return connection.promise().query(sql, values)
}

const viewDepartmentBudget = () => {
  const sql = `
    SELECT d.id, d.name AS department_name, SUM(r.salary) AS total_budget
    FROM department d
    LEFT JOIN role r ON d.id = r.department_id
    LEFT JOIN employee e ON r.id = e.role_id
    GROUP BY d.id, d.name
  `;

  return connection.promise().query(sql);
};


const removeDepartment = (department_id) => {
  const sql = 'DELETE FROM department WHERE id = ?';
  const values = [department_id];
  return connection.promise().query(sql, values);
}

  startapp();