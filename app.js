var mysql = require("mysql");
var inquirer = require("inquirer");

var fName = "employee.first_name";
var lName = "employee.last_name";
var dept =  "department.dept";
var title = "role.title";
var salary = "role.salary";
var manager = "employee.manager_id"
var roleId = "employee.role_id";
var deptId = "role.department_id";
var empId = "employee.id";
var mgrName = "CONCAT(manager.first_name, ' ', manager.last_name) AS \"manager\"";

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

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
      ]
    })
    .then(answer => {
      switch (answer.action) {
      case "View Employees":
        viewEmployees();
        break;

      case "View Departments":
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

function viewEmployees() {
    var query = `SELECT ${empId}, CONCAT(${fName}, ' ', ${lName}) AS \"Name\", ${dept}, ${title}, ${salary}, ${mgrName} FROM `;
    query += `employee JOIN role ON (${roleId} = role.id) JOIN department ON (${deptId}=department.id) `;
    query += `LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY ${salary} DESC;`;
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(res);
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

function updateRole() {
  var query = `SELECT ${fName}, ${lName}, ${title} FROM employee RIGHT JOIN role ON (${roleId}=role.id);`;
    connection.query(query, function(err, res) {
      console.table(res)
      let nameArr = res.map(employee => ({name: employee.first_name + " " + employee.last_name}));
      nameArr.filter()
// USE FILTER TO CLEAR OUT NULL VALUES FROM ARRAY

      console.log(nameArr)
      let roleArr = res.map(role => ({role: role.title}));
      inquirer
      .prompt([{
          name: "employee",
          type: "list",
          message: "Which employee's role would you like to update??",
          choices: nameArr
        },
        {
          name: "role",
          type: "list",
          message: "What is their new role?",
          choices: roleArr
        }
      ])
      .then(function(answer) {
        var query = "SELECT position, song, year FROM top5000 WHERE ?";
        connection.query(query, { artist: answer.artist }, function(err, res) {
          start();
        });
      });
    });
};

// function updateManager() {

// };

function addEmployee() {

};

function addDept() {

};

function addRole() {

};

function delEmployee() {

};

function delDept() {

};

function delRole() {

};