import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "healthcare_db",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("Connected to Database ✅");
    connection.release();
  }
});

export default db.promise(); // for promise-based queries
