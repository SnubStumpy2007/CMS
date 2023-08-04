const express = require('express')
const mysql = require('mysql2')
const figlet = require('figlet')

// const chalk = require('chalk');

//const connection = require('');
const comms = require('./config/connection')
const inquirer = require('inquirer');
const ops = require('./config/operations');
const { TextEncoderStream } = require('node:stream/web');



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
    inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter First Name:',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter Last Name:',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter Role ID:',
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'Enter Manager ID;'
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter Department ID:',
      },
    ]).then(answers => {
      addEmployee(answers.firstName, answers.lastName, answers.roleId, answers.managerId, answers.departmentId);
    });
  }
  

  if (choice === 'Remove Employee') {
    inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter First Name:',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter Last Name:',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter Role ID:',
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter Department ID:',
      },
    ]).then(answers => {
      removeEmployee(answers.firstName, answers.lastName, answers.roleId, answers.departmentId);
    });
  }

  if (choice === 'Update Employee Role') {
    inquirer
        .prompt([
            {
                name: 'employeeId',
                type: 'input',
                message: 'Enter the ID of the employee whose role you want to update:',
            },
            {
                name: 'firstName',
                type: 'input',
                message: 'Enter new First Name:',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter new Last Name:',
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'Enter new Role ID:',
            },
            {
                name: 'departmentId',
                type: 'input',
                message: 'Enter new Department ID:',
            },
        ])
        .then(answers => {
            updateEmployeeRole(
                answers.firstName,
                answers.lastName,
                answers.roleId,
                answers.departmentId,
                answers.employeeId
            );
        });
}


  if (choice === 'Update Employee Manager') {
    inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter First Name:',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter Last Name:',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter Role ID:',
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter Department ID:',
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'Enter the new manager:',
      },
    ]).then(answers => {
      updateEmployeeManager(answers.firstName, answers.lastName, answers.roleId, answers.departmentId);
    });
  

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
  prompt();
});



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
      console.error('Error executing the query:', err)
    }  

    console.table(res)
    prompt();
  })
 
}

const viewAllDepartments = () => {
  let sqlConnection =  `SELECT * FROM department`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    }  
    
    console.table(res)
    prompt();
    
  })
};

const viewAllRoles = () => {
  let sqlConnection =  `SELECT * FROM role`;
  comms.query(sqlConnection, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.table(res);
      prompt();
    }
  });
}

//done
const viewEmployeesByDepartment = () => {
  let sqlConnection =  `
  SELECT e.id, e.first_name, e.last_name, e.role_id, d.name AS department_name
  FROM employee e
  JOIN department d ON e.department_id = d.id
`;
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    }  
    console.table(res)
    prompt();    
  })
};

//done
const addEmployee = (firstName, lastName, roleId, managerId, departmentId) => {
  let sqlConnection =  `
    INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [firstName, lastName, roleId, managerId, departmentId];
  comms.query(sqlConnection, values, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.log('Employee added successfully.');
    }
    
    prompt();
  });
};

const removeEmployee = (firstName, lastName, roleId, managerId, departmentId) => {
  let sqlConnection = `
    DELETE FROM employee
    WHERE first_name = ? AND last_name = ? AND role_id = ? AND manager_id = ? AND department_id = ?
  `;
  const values = [firstName, lastName, roleId, managerId, departmentId];
  comms.query(sqlConnection, values, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.log('Employee removed successfully.');
    }
    
    prompt();
  });
};

// done
const updateEmployeeRole = (firstName, lastName, roleId, departmentId, employeeId) => {
  let sqlConnection = `
    UPDATE employee
    SET first_name = ?, last_name = ?, role_id = ?, department_id = ?
    WHERE id = ?
  `;
  const values = [firstName, lastName, roleId, departmentId, employeeId];
  
  comms.query(sqlConnection, values, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.log('Employee role updated successfully.');
    }
    
    prompt();
  });
};


const updateEmployeeManager = () => {
  let sqlConnection =  'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, department_id = ? WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    }  
    console.table(res)
    prompt();
  })
}

const addRole = () => {
  let sqlConnection =  'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    }  
    console.table(res)
    prompt();
  })
};


const removeRole = () => {
  let sqlConnection =  'DELETE FROM role WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    } 
    console.table(res)
    prompt();
  })
};


const addDepartment = () => {
  let sqlConnection =  'INSERT INTO department (name) VALUES (?)'
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    }  
    console.table(res)
    prompt();
  })
}

const removeDepartment = () => {
  let sqlConnection =  'DELETE FROM department WHERE id = ?';
  comms.query(sqlConnection,(err,res) => {
    if (err) {
      console.error('Error executing the query:', err)
    } 
    console.table(res)
    prompt();
  })
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});