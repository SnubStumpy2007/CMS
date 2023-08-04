// Import required modules
const express = require('express')
const mysql = require('mysql2')
const figlet = require('figlet')
const comms = require('./config/connection') // Import custom connections
const inquirer = require('inquirer'); // import inquirer packagee
const ops = require('./config/operations');
const { TextEncoderStream } = require('node:stream/web');



const app = express() // define this as an express app

// Define a function to prompt the user with a list of choices
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
      'Exit'
    ]
  })
  .then((answers) => {
       // Based on the user's choice, execute different functions
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
//------------------------If Then choices.  Upon selection, call the appropiate responses and then appropiate functions---------------------------------------------------
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

  if (choice === 'View All Roles') {
      viewAllRoles();
  }

  if (choice === 'Add Role') {
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter Role Title:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter Role Salary:',
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter Department ID:',
      },
    ]).then(answers => {
      addRole(answers.title, answers.salary, answers.departmentId);
    });
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

  if (choice === 'Exit') {
    console.log('Exiting the application.');
    comms.end();
    process.exit(); // Add this line to exit the application
  }
 });
};




// ----------What you see on the terminal------------
//-----------Contents from the database are displayed via a console.table or console.log method---------
//-----------Database is in MySQL---------------------
//-----------Roles are based of of what I've experienced staffing Dokidokon, an anime convention
//-----------Sample characters are characters from the video game Tales of Xillia
// Logo provided by Figlet
figlet("Welcome to the CMS!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
  prompt();
});


// Displays all Employees from the Employees table
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
// Views all Departments from the Department Table
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
// Views all Roles in the Roles table
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

// Lists Emplyess by department
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

// Adds an employee via Inquire above then adds to the database
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



// Updates Employee Role in the database
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

// Adds a Role row to the Role table
const addRole = (title, salary, departmentId) => {
  let sqlConnection = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const values = [title, salary, departmentId];

  comms.query(sqlConnection, values, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.log('Role added successfully.');
    }

    prompt();
  });
};



// Adds a departmeent row to the Department table
const addDepartment = (name) => {
  let sqlConnection = 'INSERT INTO department (name) VALUES (?)';
  const values = [name];

  comms.query(sqlConnection, values, (err, res) => {
    if (err) {
      console.error('Error executing the query:', err);
    } else {
      console.log('Department added successfully.');
    }

    prompt();
  });
};

// Starts the application via Port 3001
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});