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
    const {choice} = answers;
    if (choice === 'View All Employees') {
      viewAllEmployees();
  }

  if (choice === 'View All Departments') {
    viewAllDepartments();
  }

  if (choice === 'View All Employees By Department') {
      viewEmployeesByDepartment();
  }

  if (choice === 'Add Employee') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      addEmployee(answers.name);
    })
  }

  if (choice === 'Remove Employee') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      removeEmployee(answers.name);
    })
  }

  if (choice === 'Update Employee Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Employee Name',
    }).then(answers => {
      updateEmployeeRole(answers.name);
    })
  }

  if (choice === 'Update Employee Manager') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter the manager of the Employee',
    }).then(answers => {
      updateEmployeeManager(answers.name);
    })

  if (choice === 'View All Roles') {
      viewAllRoles();
  }

  if (choice === 'Add Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Role to Add',
    }).then(answers => {
      addRole(answers.name);
    })
  }

  if (choice === 'Remove Role') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Role Name',
    }).then(answers => {
      removeRole(answers.name);
    })
  }

  if (choice === 'Add Department') {
    inquirer.prompt({
      name: 'name',
    type: 'input',
    message: 'Enter Department Name',
    }).then(answers => {
      addDepartment(answers.name);
    })

  }

  if (choice === 'View Department Budgets') {
      viewDepartmentBudget();
  }

  if (choice === 'Remove Department') {
      removeDepartment();
  }

  if (choice === 'Exit') {
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
    prompt();
    console.table(res)
  })
  
}

const viewAllDepartments = () => {
  let sqlConnection =  `SELECT * FROM department`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
     // throw(err);
    }  
    console.table(res)
    prompt();
  })
};

const viewAllRoles = () => {
  let sqlConnection =  `SELECT * FROM roles`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
     // throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const viewEmployeesByDepartment = () => {
  let sqlConnection =  `
  SELECT e.id, e.first_name, e.last_name, e.role_id, d.name AS department_name
  FROM employee e
  JOIN department d ON e.department_id = d.id
`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
};

const addEmployee = () => {
  let sqlConnection =  `INSERT INTO employee (first_name, last_name, role_id, department_id)`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const removeEmployee = () =>{
  let sqlConnection =  'DELETE FROM employee (first_name, last_name, role_id, department_id)';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const updateEmployeeRole = () => {
  let sqlConnection =  'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const updateEmployeeManager = () => {
  let sqlConnection =  'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const addRole = () => {
  let sqlConnection =  'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
};


const removeRole = () => {
  let sqlConnection =  'DELETE FROM role WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
};


const addDepartment = () => {
  let sqlConnection =  'INSERT INTO department (name) VALUES (?)'
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

const viewDepartmentBudget = () => {
  const sql = `
    SELECT d.id, d.name AS department_name, SUM(r.salary) AS total_budget
    FROM department d
    LEFT JOIN role r ON d.id = r.department_id
    LEFT JOIN employee e ON r.id = e.role_id
    GROUP BY d.id, d.name
  `;

  return comms.query(sql); 
};


const removeDepartment = () => {
  let sqlConnection =  'DELETE FROM department WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      throw(err);
    }  
    console.table(res)
    prompt();
  })
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});