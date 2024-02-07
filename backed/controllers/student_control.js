 
import db from "../index.js";
import bcryptjs from 'bcryptjs';

// student login....
const studentlogin = (req, res) => {
  const { email, password } = req.body;
  // const {id} = req.params.id;
   console.log('stemail..',email)
  const sql = 'SELECT * FROM student WHERE email = ?'; // Remove WHERE clause
  db.query(sql, [email], async (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Compare the hashed password with the provided password
      const hashedPasswordFromDB = results[0].password;

      const passwordMatch = await bcryptjs.compare(password, hashedPasswordFromDB);

      if (passwordMatch) {
        // Admin credentials are valid, create a JWT token
        const token = jwt.sign({ ROLE_TYPE: email }, process.env.JWT_SECRET, { expiresIn: '2d' });

        // Send the token back to the client as a cookie
        res.cookie('cookie', token);

        // Send additional data in the response body if needed
        res.json({  id:results[0].id, ROLE_TYPE: 'Student', email: results[0].email,gender:results[0].gender,firstname: results[0].first_name,profile:results[0].profile,address:results[0].address});


      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
};
export {
  studentlogin,
};

