-- 1. Create Database
CREATE DATABASE IF NOT EXISTS student_identity_db;
USE student_identity_db;

-- 2. Table: System Users (For Admin Login)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords in production
    role ENUM('Admin', 'Security', 'Registrar') DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: Students
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY, -- e.g., SID-2025-001
    matric_no VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    level VARCHAR(10), -- e.g., 100, 200
    gender ENUM('Male', 'Female') NOT NULL,
    dob DATE,
    email VARCHAR(100) UNIQUE,
    passport_url VARCHAR(255), -- Path to image file
    status ENUM('Active', 'Suspended', 'Graduated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: ID Cards (For Issuance History)
CREATE TABLE IF NOT EXISTS id_cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    card_status ENUM('Valid', 'Expired', 'Lost') DEFAULT 'Valid',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- SAMPLE DATA INSERTION (For Testing)
-- ---------------------------------------------------------

-- Insert Default Admin User (Password: 'admin123') 
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', 'admin123', 'Admin');

-- Insert Dummy Students
INSERT INTO students (student_id, matric_no, first_name, last_name, department, level, gender, dob, email, status)
VALUES 
('SID-2025-1001', 'ENG/25/0045', 'Chioma', 'Adeyemi', 'Computer Science', '300', 'Female', '2003-05-12', 'chioma.a@uni.edu.ng', 'Active'),
('SID-2025-1002', 'BUS/25/1102', 'Ibrahim', 'Musa', 'Business Admin', '200', 'Male', '2004-11-20', 'i.musa@uni.edu.ng', 'Active'),
('SID-2025-1003', 'LAW/25/0099', 'Emeka', 'Okafor', 'Law', '400', 'Male', '2002-08-15', 'emeka.o@uni.edu.ng', 'Suspended');

-- Insert ID Card History
INSERT INTO id_cards (student_id, issue_date, expiry_date, card_status)
VALUES 
('SID-2025-1001', '2025-01-15', '2026-01-15', 'Valid'),
('SID-2025-1002', '2025-02-01', '2026-02-01', 'Valid');