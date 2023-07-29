// employee.js
const addEmployee = require('./employee'); // Assuming the function is defined in this file

// Function to handle adding an employee
function handleAddEmployee() {
  addEmployee('John', 'Doe', 1, 1)
    .then((result) => {
      console.log('Employee added:', result);
    })
    .catch((err) => {
      console.error('Error adding employee:', err);
    });
}

// Call the function to add an employee
handleAddEmployee();



module.exports = operations;