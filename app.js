const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const fName = "employee.first_name";
const lName = "employee.last_name";
const dept =  "department.dept";
const title = "role.title";
const salary = "role.salary";
const manager = "employee.manager_id"
const roleId = "employee.role_id";
const deptId = "role.department_id";
const empId = "employee.id";
const mgrName = "CONCAT(manager.first_name, ' ', manager.last_name) AS \"manager\"";

// connection to mysql
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db",
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) throw err;
  console.log()

  start();
});

// initial function to ask user what they would like to do
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Department",
        "View Roles",
        // "View Utilized Budget of Department",
        "Update Employee Role",
        // "Update Employee Manager",
        "Add Employee",
        "Add Department",
        "Add Role",
        // "Delete Employee",
        // "Delete Department",
        // "Delete Role"
        "Exit"
      ]
    })
    .then(answer => {
      switch (answer.action) {
      case "View Employees":
        viewEmployees();
        break;

      case "View Employees by Department":
        viewDept();
        break;

      case "View Roles":
        viewRoles();
        break;

    //   case "View Utilized Budget of Department":
    //     deptBudget();
    //     break;

      case "Update Employee Role":
        updateRole();
        break;
      
    //   case "Update Employee Manager":
    //     updateManager();
    //     break;
      
      case "Add Employee":
        addEmployee();
        break;
      
      case "Add Department":
        addDept();
        break;
      
      case "Add Role":
        addRole();
        break;

      case "Exit":
        console.log("Have a nice day!")
        process.exit()
        break;
      
    //   case "Delete Employee":
    //     delEmployee();
    //     break;
      
    //   case "Delete Department":
    //     delDept();
    //     break;
      
    //   case "Delete Role":
    //     delRole();
    //     break;
      }
    });
}

// functions to handle the user's choice

function viewEmployees() {
    var query = `SELECT ${empId}, CONCAT(${fName}, ' ', ${lName}) AS \"Name\", ${dept}, ${title}, ${salary}, ${mgrName} FROM `;
    query += `employee JOIN role ON (${roleId} = role.id) JOIN department ON (${deptId}=department.id) `;
    query += `LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY ${salary} DESC;`;
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });  
};

function viewDept() {
    var query = `SELECT ${dept}, CONCAT(${fName}, ' ', ${lName}) AS \"Name\", ${title}, ${salary}, ${mgrName} FROM `;
    query += `employee JOIN role ON (${roleId} = role.id) JOIN department ON (${deptId}=department.id) `;
    query += `LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY ${dept};`;
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });  
};

function viewRoles() {
  var query = `SELECT ${title}, ${salary}, ${dept} FROM role LEFT JOIN `
  query += `department ON (${deptId} = department.id) ORDER BY ${salary} DESC;`
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};

// function deptBudget() {

// };

// Update an employee's role
function updateRole() {
  var query = `SELECT ${fName}, ${lName}, ${title} FROM employee RIGHT JOIN role ON (${roleId}=role.id);`;
    connection.query(query, function(err, res) {
      let nameArr = res.map(employee => (employee.first_name + " " + employee.last_name));
      nameArr = nameArr.filter(employee => (employee !="null null"));
      let roleArr = res.map(employee => (employee.title));
      roleArr = Array.from(new Set(roleArr));
      inquirer
      .prompt([{
          name: "employee",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: nameArr
        },
        {
          name: "role",
          type: "list",
          message: "What is their new role?",
          choices: roleArr
        }
      ])
      .then(function(answers) {
        var query = `UPDATE employee SET role_id = ? WHERE CONCAT (${fName}, ' ', ${lName}) =?`;
        connection.query(`SELECT id FROM role WHERE title = ?`, answers.role, function(err, res) {
          if (err) throw err;
          connection.query(query, [res[0].id, answers.employee], function(err, res) {
            if (err) throw err;
            start();
          });
        });


      });
    });
};

// function updateManager() {

// };

// Add a new employee
function addEmployee() {
  var query = `SELECT ${fName}, ${lName}, ${title} FROM employee RIGHT JOIN role ON (${roleId}=role.id);`;
    connection.query(query, function(err, res) {
      let nameArr = res.map(employee => (employee.first_name + " " + employee.last_name));
      nameArr = nameArr.filter(employee => (employee !="null null"));
      let roleArr = res.map(employee => (employee.title));
        inquirer.prompt([{
          type: "input",
          name: "firstName",
          message: "What is the employees first name?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?"
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roleArr
        },
        {
          type: "list",
          name: "mgr",
          message: "Who is this employee's manager?",
          choices: nameArr
        }
        ]).then(answers => {
          connection.query(`SELECT id FROM role WHERE title = ?; SELECT id FROM employee WHERE CONCAT (${fName}, ' ', ${lName}) = ?;`, [answers.role, answers.mgr], function(err, res) {
            if (err) throw err;
            var query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(query, [answers.firstName.trim(), answers.lastName.trim(), res[0][0].id, res[1][0].id], function(err, res) {
              if (err) throw err;
              console.log(`${answers.firstName} ${answers.lastName} has been added to the employee database.`);
              start();
          });
        });
      });
    });
};

// Add a new department
function addDept() {
  inquirer.prompt({
    type: "input",
    name: "newDept",
    message: "What department would you like to add?"
  }).then(answers => {
        var query = `INSERT INTO department (dept) VALUES (?)`;
        connection.query(query, answers.newDept.trim(), function(err, res) {
          if (err) throw err;
          console.log(`${answers.newDept} has been added to the department database.`);
          start();
        })
      });
};

// Add a new role
function addRole() {

};

// function delEmployee() {

// };

// function delDept() {

// };

// function delRole() {

// };