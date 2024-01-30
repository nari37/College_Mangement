 
import db from "../index.js";

const  login = (req, res) => {
    try {
      const { email,password,name } = req.body;
      console.log(email, password,name);
  
      const sql = 'INSERT INTO student (email, password, name) VALUES (?, ?, ?)';
      db.query(sql, [email, password,name], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error inserting data into student table' });
        }
  
        res.status(200).json({ message: 'Successfully inserted data into student table', result });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
export default login;

