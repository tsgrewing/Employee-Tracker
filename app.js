var mysql = require("mysql");
var inquirer = require("inquirer");

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
        "View Departments",
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
    .then(function(answer) {
      switch (answer.action) {
      case "View Employees":
        viewEmployeer();
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
    var query = "SELECT employee.first_name, employee.last_name, department.dept, role.title, role.salary, employee.manager_id";
    query += "FROM employee JOIN role ON (employee.role_id = role.id) JOIN department ON (role.department_id=department.id);";
    connection.query(query, function(err, res) {
        console.table(res)
    });
        start();
};
