const express = require('express')
const mysql = require('mysql2')
const figlet = require('figlet')

// const chalk = require('chalk');

//const connection = require('');
const comms = require('./config/connection')
const inquirer = require('inquirer');
const ops = require('./config/operations')


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
    if (answers.choice === 'View All Employees') {
      viewAllEmployees();
  }

  if (choices === 'View All Departments') {
    viewAllDepartments();
  }

  if (choices === 'View All Employees By Department') {
      viewEmployeesByDepartment();
  }

  if (choices === 'Add Employee') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      addEmployee(answers.name);
    })
  }

  if (choices === 'Remove Employee') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      removeEmployee(answers.name);
    })
  }

  if (choices === 'Update Employee Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      updateEmployeeRole(answers.name);
    })
  }

  if (choices === 'Update Employee Manager') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter the manager of the Employee',
    }).then(answers => {
      updateEmployeeManager(answers.name);
    })

  if (choices === 'View All Roles') {
      viewAllRoles();
  }

  if (choices === 'Add Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Role to Add',
    }).then(answers => {
      addRole(answers.name);
    })
  }

  if (choices === 'Remove Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Role Name',
    }).then(answers => {
      removeRole(answers.name);
    })
  }

  if (answers.choice === 'Add Department') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Department Name',
    }).then(answers => {
      addDepartment(answers.name);
    })

  }

  if (choices === 'View Department Budgets') {
      viewDepartmentBudget();
  }

  if (choices === 'Remove Department') {
      removeDepartment();
  }

  if (choices === 'Exit') {
      comms.end();
  }
  
  }})
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

prompt();

const viewAllEmployees = () => {
  let sqlConnection =  `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS 'department', 
  role.salary
  FROM employee, role, department 
  WHERE department.id = role.department_id 
  AND role.id = employee.role_id
  ORDER BY employee.id ASC`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.log(err)
    }  
    console.table(res)
  })
}

const viewAllDepartments = () => {
  return comms.query('SELECT * FROM department');
};

const viewAllRoles = () => {
  return comms.query('SELECT * FROM role')
}

const viewEmployeesByDepartment = () => {
  const sql = `
    SELECT e.id, e.first_name, e.last_name, e.role_id, d.name AS department_name
    FROM employee e
    JOIN department d ON e.department_id = d.id
  `;
  return comms.query(sql); 
};

const addEmployee = (firstName, lastName, roleId, departmentId) => {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, department_id)'
  const values = [firstName, lastName, roleId, departmentId]
  return comms.query(sql, values)
}

const removeEmployee = (firstName, lastName, roleId, departmentId) =>{
  const sql = 'DELETE FROM employee (first_name, last_name, role_id, department_id)'
  const values = [firstName, lastName, roleId, departmentId]
  return comms.query(sql, values)
}

const updateEmployeeRole = (firstName, lastName, roleId, departmentId) => {
  const sql = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  const values = [firstName, lastName, roleId, departmentId]
  return comms.query(sql, values)
}

const updateEmployeeManager = (firstName, lastName, roleId, departmentId, managerId) => {
  const sql = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  const values = [firstName, lastName, roleId, departmentId, managerId]
  return comms.query(sql, values)
}

const addRole = (title, salary, departmentId) => {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const values = [title, salary, departmentId];
  return comms.query(sql, values)
};


const removeRole = (roleId) => {
  const sql = 'DELETE FROM role WHERE id = ?';
  const values = [roleId];
  return comms.query(sql, values)
};


const addDepartment = (departmentId) => {
  const sql = 'INSERT INTO department (name) VALUES (?)'
  const values = [departmentId]
  return comms.query(sql, values)
}

const viewDepartmentBudget = () => {
  const sql = `
    SELECT d.id, d.name AS department_name, SUM(r.salary) AS total_budget
    FROM department d
    LEFT JOIN role r ON d.id = r.department_id
    LEFT JOIN employee e ON r.id = e.role_id
    GROUP BY d.id, d.name
  `;

  return comms.query(sql); // Remove 'values' from the query call
};


const removeDepartment = (department_id) => {
  const sql = 'DELETE FROM department WHERE id = ?';
  const values = [department_id];
  return comms.query(sql, values)
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});