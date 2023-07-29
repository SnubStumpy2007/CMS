DROP DATABASE IF EXISTS CMS
CREATE DATABASE CMS

USE CMS;
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);
CREATE TABLE role (
 id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    salary decimal(10,2),
    department_ID int
);
CREATE TABLE employee (
 id INT AUTO_INCREMENT PRIMARY KEY,
 first_name VARCHAR(255),
 last_name VARCHAR(255),
 role_id int,
    manager_id int
);