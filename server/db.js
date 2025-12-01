import mysql from "mysql2";

// 1. If we are on Vercel, use the Railway Public URL
// 2. If we are on Localhost, use the manual settings
const dbConfig = process.env.MYSQL_PUBLIC_URL || {
  host: "localhost",
  user: "root",
  password: "Leavemealoneabeg@123!",
  database: "student_identity_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export default pool.promise();
