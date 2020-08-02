DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE department (
	ID INT AUTO_INCREMENT PRIMARY KEY,
    Department VARCHAR(30)
);

CREATE TABLE role (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(30),
    Salary DECIMAL, 
    Department_id INT,
    FOREIGN KEY (Department_id) REFERENCES department (ID) ON DELETE CASCADE
);

CREATE TABLE employee (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT DEFAULT NULL,
    FOREIGN KEY(role_id) REFERENCES role (id) ON DELETE CASCADE
);