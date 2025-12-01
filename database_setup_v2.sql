DROP DATABASE IF EXISTS student_identity_db;
CREATE DATABASE student_identity_db;
USE student_identity_db;

-- 1. Lookup Tables (Normalization)
CREATE TABLE Department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Programme (
    programme_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
);

CREATE TABLE Card_Status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE -- 'Active', 'Lost', 'Expired'
);

-- 2. Main Tables
CREATE TABLE Student (
    student_id VARCHAR(20) PRIMARY KEY, -- 'SID-2025-001'
    matric_no VARCHAR(20) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    dob DATE,
    gender ENUM('Male', 'Female'),
    department_id INT,
    programme_id INT,
    FOREIGN KEY (department_id) REFERENCES Department(dept_id),
    FOREIGN KEY (programme_id) REFERENCES Programme(programme_id)
);

CREATE TABLE Identity_Card (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) UNIQUE NOT NULL, -- 'ID-2025-XXXX'
    student_id VARCHAR(20),
    issue_date DATE,
    expiry_date DATE,
    status_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Card_Status(status_id)
);

CREATE TABLE Card_Issuance (
    issuance_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT,
    issued_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by VARCHAR(50), -- Admin Username
    reason VARCHAR(100), -- 'New Intake', 'Replacement'
    FOREIGN KEY (card_id) REFERENCES Identity_Card(card_id)
);

-- 3. Users (For Admin Login)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20)
);

-- ---------------------------------------------------------
-- SEED DATA (Critical for Member 7 Queries to work)
-- ---------------------------------------------------------

-- Insert Departments & Programmes
INSERT INTO Department (name) VALUES ('Computer Science'), ('Electrical Engineering'), ('Business Admin');
INSERT INTO Programme (name, dept_id) VALUES ('B.Sc Computer Science', 1), ('B.Eng Electrical', 2), ('B.Sc Accounting', 3);

-- Insert Card Statuses (Required by check_id_validity.sql)
INSERT INTO Card_Status (status_name) VALUES ('Active'), ('Lost'), ('Expired'), ('Suspended');

-- Insert Students
INSERT INTO Student (student_id, matric_no, first_name, last_name, email, gender, dob, department_id, programme_id) VALUES 
('SID-2025-001', 'MAT/25/001', 'Chioma', 'Adeyemi', 'chioma@uni.edu.ng', 'Female', '2003-05-12', 1, 1),
('SID-2025-002', 'MAT/25/002', 'Ibrahim', 'Musa', 'ibrahim@uni.edu.ng', 'Male', '2002-11-20', 3, 3);

-- Insert Identity Cards (Required by active_students.sql)
INSERT INTO Identity_Card (card_number, student_id, issue_date, expiry_date, status_id) VALUES 
('ID-2025-000123', 'SID-2025-001', '2025-01-01', '2029-01-01', 1), -- Active
('ID-2025-999999', 'SID-2025-002', '2024-01-01', '2025-01-01', 3); -- Expired

-- Insert Issuance History (Required by issuance_history.sql)
INSERT INTO Card_Issuance (card_id, issued_by, reason) VALUES 
(1, 'Admin01', 'First Issue'),
(2, 'Admin01', 'First Issue');