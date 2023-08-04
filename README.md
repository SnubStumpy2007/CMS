## Employee Management System using Node.js and MySQL
This is an Employee Management System built with Node.js and MySQL, providing a command-line interface (CLI) to manage employees, roles, and departments within an organization.

# Table of Contents
Introduction
Requirements
Installation
Usage
Functionality
License
Introduction
The Employee Management System is a CLI application that allows users to perform various tasks related to managing employees, roles, and departments. It uses Node.js for the application logic and MySQL as the database to store employee information.

# Requirements
Node.js (v12 or above)
MySQL database (make sure you have the necessary credentials)
Installation
Clone this repository to your local machine:
bash
Copy code
git clone https://github.com/your-username/employee-management-system.git
Change to the project directory:
bash
Copy code
cd employee-management-system
Install the required dependencies:
bash
Copy code
npm install

# Set up your MySQL database:

Create a new database for the application (e.g., employee_management_db).
Make sure to have your MySQL credentials ready (host, user, password).
Create a .env file in the project root and add your MySQL credentials:


DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name

# Usage
To run the application, execute the following command in the project directory:

node index.js
The application will start, and you'll see the welcome message along with the available options.

# Functionality
The Employee Management System provides the following functionality through the CLI:

View all employees, roles, and departments.
View employees by department.
View department budgets.
Add, update, and remove employees, roles, and departments.
Update employee role and manager.


![cms](https://github.com/SnubStumpy2007/CMS/assets/25469843/cf0cf9a3-be6a-42e3-8d3d-619cab4f006a)

# License
MIT License

# Sources
https://github.com/WilliamCrownover/employee-content-management-system
https://www.simplilearn.com/tutorials/nodejs-tutorial/nodejs-mysql
https://github.com/jpd61/employee-tracker
https://www.npmjs.com/package/figlet
https://dev.mysql.com/doc/refman/8.0/en/select.html
https://dev.mysql.com/doc/refman/8.0/en/join.html
https://darifnemma.medium.com/how-to-interact-with-mysql-database-using-async-await-promises-in-node-js-9e6c81b683da
https://www.w3schools.com/sql/sql_select.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
Tutor Jacob Carver
https://www.w3schools.com/sql/sql_delete.asp