INSERT INTO department (dept) VALUES
("Accounting")
("Production")
("Retail")
("Sales")
("Management")

SELECT * FROM department;

INSERT INTO role (title, salary, department_id) VALUES
("Accounts Payable", 45000, 1)
("Accounts Receivable", 45000, 1)
("Lead Roaster", 50000, 2)
("Assistant Roaster", 40000, 2)
("Production Assistant", 35000, 2)
("Delivery Driver", 35000, 2)
("Barista", 25000, 3)
("Shift Lead", 27500, 3)
("Barista Trainer", 27500, 3)
("Grocery Sales Rep", 33500, 4)
("Wholesale Sales Rep", 33500, 4)
("Wholesale Demo Specialist", 30000, 4)
("Cafe Manager", 33500, 5)
("Production Manager", 45000, 5)
("Operations Manager", 55000, 5)
("Retail Manager", 37500, 5)
("CEO", 80000, 5)

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Erica", "Holmes", 1, null)
("Christina", "Marks", 2, null)
("Dennis", "Feinstien", 3, 15)
("Jim", "Jameson", 4, 3)
("Sean", "Bean", 5, 14)
("Josh", "McDermot", 6, 14)
("Shana", "Elmsford", 7, 13)
("Elmo", "McElroy", 8, 13)
("Robbie", "Hart", 9, 16)
("Sonia", "Kincaid", 10, 15)
("Trina", "Malone", 11, 15)
("Steven", "Gerrard", 12, 10)
("Ray", "Arnold", 13, 16)
("Tony", "Grewing", 14, 15)
("Rudy", "Ruettiger", 15, null)
("Michael", "Glass", 16, )


SELECT * FROM employee;

