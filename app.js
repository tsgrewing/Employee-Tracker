const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const fName = "employee.first_name";
const lName = "employee.last_name";
const dept =  "department.department";
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
  console.log(`
  ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
  ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
  █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
  ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
  ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
  ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                       
  ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗             
  ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗            
     ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝            
     ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗            
     ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║            
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝            
                                                                                                                          
  `)
  checkDept();
});


// Functions to check if the tables are empty, and if they are prompt the user to add the necessary info
function checkDept () {
  connection.query(`SELECT * FROM department`, (err, res) =>{
    if (err) throw err;
    if (res.length === 0) {
      console.log("Please add a department");
      addDept();
    }
    else{checkRole()};
  })
};

function checkRole () {
  connection.query(`SELECT * FROM role`, (err, res) =>{
    if (err) throw err;
    if (res.length === 0) {
      console.log("Please add a role");
      addRole();
    }
    else {checkEmployee()};
  })
};

function checkEmployee () {
  connection.query(`SELECT * FROM employee`, (err, res) =>{
    if (err) throw err;
    if (res.length === 0) {
      console.log("Please add an employee");
      addEmployee();
    }
    else {start()};
  })
};

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
        "View Departments",
        // "View Utilized Budget of Department",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Delete Employee",
        "Delete Department",
        "Delete Role",
        "Exit"
      ]
    })
    .then(answer => {
      switch (answer.action) {
      case "View Employees":
        viewEmployees();
        break;

      case "View Employees by Department":
        viewByDept();
        break;

      case "View Roles":
        viewRoles();
        break;

      case "View Departments":
        viewDept();
        break;

      // case "View Utilized Budget of Department":
      //   deptBudget();
      //   break;

      case "Update Employee Role":
        updateRole();
        break;
      
      case "Update Employee Manager":
        updateManager();
        break;
      
      case "Add Employee":
        addEmployee();
        break;
      
      case "Add Department":
        addDept();
        break;
      
      case "Add Role":
        addRole();
        break;

      case "Delete Employee":
        delEmployee();
        break;
      
      case "Delete Department":
        delDept();
        break;
      
      case "Delete Role":
        delRole();
        break;

      case "Exit":
        console.log("Have a nice day!")
        process.exit()
        break;
      }
    });
}

// functions to handle the user's choice

function viewEmployees() {
    var query = `SELECT ${empId}, CONCAT(${fName}, ' ', ${lName}) AS \"Name\", ${dept}, ${title}, ${salary}, ${mgrName} FROM `;
    query += `employee JOIN role ON (${roleId} = role.id) JOIN department ON (${deptId}=department.id) `;
    query += `LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY ${salary} DESC;`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });  
};

function viewByDept() {
  var query = `SELECT department FROM department;`;
  connection.query(query, (err, res) => {
    var deptArr = res.map(dept => (dept.department))
    if (err) throw err;
    inquirer
    .prompt({
        name: "choice",
        type: "list",
        message: "Which department would you like to view?",
        choices: deptArr
      }).then(answer => {
        var query = `SELECT ${dept}, CONCAT(${fName}, ' ', ${lName}) AS \"Name\", ${title}, ${salary}, ${mgrName} FROM `;
        query += `employee JOIN role ON (${roleId} = role.id) JOIN department ON (${deptId}=department.id) AND ${dept} = ? `;
        query += `LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
        connection.query(query, answer.choice, (err, res) => {
          if (err) throw err;
          console.table(res);
          start();
        });
      })
  });
};

function viewRoles() {
  var query = `SELECT ${title}, ${salary}, ${dept} FROM role LEFT JOIN `
  query += `department ON (${deptId} = department.id) ORDER BY ${salary} DESC;`
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

function viewDept() {
  var query = `SELECT * FROM department;`;
  connection.query(query, (err, res) => {
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
    connection.query(query, (err, res) => {
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
      .then(answers => {
        var query = `UPDATE employee SET role_id = ? WHERE CONCAT (${fName}, ' ', ${lName}) =?`;
        connection.query(`SELECT id FROM role WHERE title = ?`, answers.role, (err, res) => {
          if (err) throw err;
          connection.query(query, [res[0].id, answers.employee], (err, res) => {
            if (err) throw err;
            start();
          });
        });
      });
    });
};

function updateManager() {
  var query = `SELECT ${empId}, ${fName}, ${lName}, ${mgrName} FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, res) => {
      let nameArr = res.map(employee => (employee.first_name + " " + employee.last_name));
      nameArr = nameArr.filter(employee => (employee !="null null"));
      inquirer
      .prompt([{
          name: "employee",
          type: "list",
          message: "Which employee's manager would you like to update?",
          choices: nameArr
        },
        {
          name: "mgr",
          type: "list",
          message: "Who is their new manager?",
          choices: nameArr
        }
      ])
      .then(answers => {
        var query = `UPDATE employee SET ${manager} = ? WHERE CONCAT (${fName}, ' ', ${lName}) =?`;
        connection.query(`SELECT id FROM employee WHERE CONCAT (${fName}, ' ', ${lName}) = ?`, answers.mgr, (err, res) => {
          if (err) throw err;
          connection.query(query, [res[0].id, answers.employee], (err, res) => {
            if (err) throw err;
            start();
          });
        });


      });
    });
};

// Add a new employee
function addEmployee() {
  var query = `SELECT ${fName}, ${lName}, ${title} FROM employee RIGHT JOIN role ON (${roleId}=role.id);`;
    connection.query(query, (err, res) => {
      let nameArr = res.map(employee => (employee.first_name + " " + employee.last_name));
      nameArr = nameArr.filter(employee => (employee !="null null"));
      nameArr.push("None")
      let roleArr = res.map(employee => (employee.title));
      roleArr = Array.from(new Set(roleArr));
        inquirer.prompt([{
          type: "input",
          name: "firstName",
          message: "What is the employees first name?",
          validate: validateName
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?",
          validate: validateName
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
          choices: nameArr,
        }
        ]).then(answers => {
          if (answers.mgr != "None"){
            connection.query(`SELECT id FROM role WHERE title = ?; SELECT id FROM employee WHERE CONCAT (${fName}, ' ', ${lName}) = ?;`, [answers.role, answers.mgr], (err, res) => {
              if (err) throw err;
              var query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              connection.query(query, [answers.firstName.trim(), answers.lastName.trim(), res[0][0].id, res[1][0].id], (err, res) => {
                if (err) throw err;
                console.log(`${answers.firstName} ${answers.lastName} has been added to the employee database.`);
                start();
              });
            });
          }
          else {
            connection.query(`SELECT id FROM role WHERE title = ?`, answers.role, (err, res) => {
              if (err) throw err;
              var query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              connection.query(query, [answers.firstName.trim(), answers.lastName.trim(), res[0].id, null], (err, res) => {
                if (err) throw err;
                console.log(`${answers.firstName} ${answers.lastName} has been added to the employee database.`);
                start();
              });
            });
          }
      });
    });
};

// Add a new department
function addDept() {
  inquirer.prompt({
    type: "input",
    name: "newDept",
    message: "What department would you like to add?",
    validate: validateName
  }).then(answers => {
        var query = `INSERT INTO department (department) VALUES (?)`;
        connection.query(query, answers.newDept.trim(), (err, res) => {
          if (err) throw err;
          console.log(`${answers.newDept} has been added to the department database.`);
          checkRole();
        })
      });
};

// Add a new role
function addRole() {
    connection.query(`SELECT department FROM department`, (err, res) => {
      let deptArr = res.map(data => (data.department));
        inquirer.prompt([{
          type: "input",
          name: "roleTitle",
          message: "What is the title of the new role?",
          validate: validateName
        },
        {
          type: "input",
          name: "salary",
          message: "What is this role's salary?",
          validate: function validateAge(salary) {
                      var num = /^\d+$/;
                      return num.test(salary) || "Salary should be a number";
                    }
        },
        {
          type: "list",
          name: "roleDept",
          message: "What department is this role in?",
          choices: deptArr
        }
        ]).then(answers => {
          connection.query(`SELECT id FROM department WHERE ${dept} = ?;`, answers.roleDept, (err, res) => {
            if (err) throw err;
            var query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answers.roleTitle.trim(), parseInt(answers.salary), res[0].id], (err, res) => {
              if (err) throw err;
              console.log(`${answers.roleTitle} has been added to the roles database.`);
              checkEmployee();
          });
        });
      });
    });
};

function delEmployee() {
  var query = `SELECT ${fName}, ${lName} FROM employee;`;
  connection.query(query, (err, res) => {
    let nameArr = res.map(employee => (employee.first_name + " " + employee.last_name));
    nameArr = nameArr.filter(employee => (employee !="null null"));
    inquirer
    .prompt({
        name: "employee",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: nameArr
      }
    ).then(answers => {
      var query = `SELECT id FROM employee WHERE CONCAT (${fName}, ' ', ${lName}) =?`;
      connection.query(query, answers.employee, (err, res) => {
          var query = `DELETE FROM employee WHERE ${empId} = ?;`
          var empNum = res[0].id
          connection.query(query, empNum, (err, res) => {
            if (err) throw err;
            console.log(`${answers.employee} has been removed from the database`)
            checkEmployee()
          });
      });
    });
  });
};

function delDept() {
  var query = `SELECT department FROM department;`;
  connection.query(query, (err, res) => {
    var deptArr = res.map(dept => (dept.department))
    if (err) throw err;
    inquirer
    .prompt({
        name: "choice",
        type: "list",
        message: "Which department would you like to delete?",
        choices: deptArr
      }).then(answer => {
        connection.query(`SELECT id FROM department WHERE ${dept} = ?`, answer.choice, (err, res) => {
          if (err) throw err;
          var query = `DELETE FROM department WHERE id = ?;`
          var deptNum = res[0].id
          connection.query(query, deptNum, (err, res) => {
            if (err) throw err;
            console.log(`${answer.choice} has been removed from the database, along with all related roles and employees`)
            checkDept();
        });
      })  
    })
  });
};


function delRole() {
  var query = `SELECT title FROM role;`;
  connection.query(query, (err, res) => {
    var roleArr = res.map(role => (role.title))
    if (err) throw err;
    inquirer
    .prompt({
        name: "choice",
        type: "list",
        message: "Which role would you like to delete?",
        choices: roleArr
      }).then(answer => {
        connection.query(`SELECT id FROM role WHERE ${title} = ?`, answer.choice, (err, res) => {
          if (err) throw err;
          var query = `DELETE FROM role WHERE id = ?;`
          var roleNum = res[0].id;
          connection.query(query, roleNum, (err, res) => {
            if (err) throw err;
            console.log(`${answer.choice} has been removed from the database, along with all related employees`)
            checkRole();
        });
      })  
    })
  });
};

const validateName = async (input) => {
  var text = /^[a-zA-Z_ ]+$/;
  return text.test(input) || "Please provide a valid name"
}