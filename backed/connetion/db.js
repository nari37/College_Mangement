// db.js
import mysql from 'mysql';

const db = mysql.createConnection({
  password: '',
  host: 'localhost',
  user: 'root',
  database: 'college_management'
});

db.connect((err) => {
  if (!err) {
    console.log('Database connected success...');
  } else {
    console.log('Database not connected..');
  }
});

export default db;
