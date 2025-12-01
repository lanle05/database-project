import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Leavemealoneabeg@123!", // Your preserved password
  database: "student_identity_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Using ES Module export
export default pool.promise();
