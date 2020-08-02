const connection = ("../app.js")
// Functions to check if the tables are empty, and if they are prompt the user to add the necessary info
var checks = {
    checkDept:  () => {
        connection.query(`SELECT * FROM department`, function(err, res){
        if (err) throw err;
        if (res = []) {
            console.log("Please add a department");
            addDept();
        }
        checkRole()
        })
    },
    
    checkRole:  () => {
        connection.query(`SELECT * FROM role`, function(err, res){
        if (err) throw err;
        if (res = []) {
            console.log("Please add a role");
            addRole();
        }
        else {checkEmployee()};
        })
    },
    
    checkEmployee:  () => {
        connection.query(`SELECT * FROM employee`, function(err, res){
        if (err) throw err;
        if (res = []) {
            console.log("Please add an employee");
            addEmployee();
        }
        else {start()};
        })
    }
};

module.exports = checks;