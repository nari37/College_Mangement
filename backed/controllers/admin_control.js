import db from "../index.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();




// admin login....
const adminlogin = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM admin'; // Remove WHERE clause
  db.query(sql, async (error, results) => {
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
        res.json({  id:results[0].id, ROLE_TYPE: 'Admin', email: results[0].email,gender:results[0].gender,firstname: results[0].first_name,profile:results[0].profile,address:results[0].address});


      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
};

  

//   get admindetails....
const admingetdeatils = (req,res)=>{
   const sql = "SELECT * FROM admin"
   db.query(sql,(err,result)=>{
if(err){
  console.log(err);
  res.status(500).json({message:"internal server error"})
}else{
  res.status(200).json({ message: "Data received successfully", data: result }); 
  
}
   })
}




  const updateprofile = (req, res) => {
    const data = req.body;
  
    console.log('admin details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  
    console.log("data is", data);
  
    const hashedpassword = bcryptjs.hashSync(req.body.password, 10);
    console.log("hashed.....", hashedpassword);
  
    const values = [
      req.body.firstName,
      req.body.email,
      req.body.gender,
      hashedpassword,
      req.body.address,
      req.file.filename
    ];
  
    const sql = "UPDATE admin SET first_name=?, email=?, gender=?, password=?, address=?, profile=? WHERE ROLE_TYPE = 'Admin'";
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Updated successfully", result });
      }
    });
  };
  

// ...addcourse..
  const addcourse = (req, res) => {
    try {
      const { course } = req.body;
  
      // Check if the course already exists
      const checkExistenceQuery = 'SELECT * FROM course WHERE course_type = ?';
      db.query(checkExistenceQuery, [course], (checkError, checkResults) => {
        if (checkError) {
          console.error('Error checking course existence:', checkError);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        // If course already exists, handle it accordingly
        if (checkResults.length > 0) {
          return res.status(400).json({ error: 'Course already exists' });
        }
  
        // If course does not exist, proceed with the insertion
        const insertQuery = 'INSERT INTO course (`course_type`) VALUES (?)';
        db.query(insertQuery, [course], (insertError, result) => {
          if (insertError) {
            console.error('Error inserting course:', insertError);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          res.status(200).json({ message: 'Successfully inserted into Course table', result });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//...get course..
  const getcourse = (req, res) => {
    try {
      const sql = "SELECT * FROM `course`";
      db.query(sql, (err,results)=>{
        if (err) {
            console.error('Error retrieving course data:', err);
            return res.status(500).json({ error: 'Internal server error' });
          } else{
            res.status(200).json({ message: 'Data received successfully', results });
          }
         
        })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  //...getsingle course....
  const getsinglecourse = (req, res) => {
    const courseid = req.params.courseid; // Use req.params.courseid
  
    try {
      const sql = 'SELECT * FROM course WHERE `id` = ?';
      db.query(sql, [courseid], (err, results) => {
        if (err) {
          console.error('Error retrieving course data:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.length === 0) {
          // If no course is found with the given id
          return res.status(404).json({ error: 'Course not found' });
        }
  
        res.status(200).json({ message: 'Data received successfully', results });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
//   ..update single course..
const updatecourse = (req, res) => {
    const { editcourseid } = req.params;
    const { course_type } = req.body;
    console.log('course...',course_type ,'couid...',editcourseid)
  
    const sql = 'UPDATE course SET course_type = ? WHERE id = ?';
    db.query(sql, [course_type, editcourseid], (err, result) => {
      if (err) {
        console.error('Error updating course data:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the course with the specified id was not found
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json({ message: 'Course updated successfully' });
    });
  };
//   delete the course...
const deletecourse = (req, res) => {
    const id = req.params.id; // Extract the 'id' from req.params
    const sql = "DELETE FROM course WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error in deletion' });
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Deleted Successfully', result });
        } else {
          res.status(404).json({ message: 'Course not found' });
        }
      }
    });
};

  // add student....

  // const addstudent = 
  //   async (req, res) => {
  //     try {
  //       const {
  //         firstName,
  //         email,
  //         gender,
  //         password,
  //         address,
  //         courses,
  //       } = req.body;
  //   console.log(req.body)
  //       // Handle the file upload if it exists
  //       if (req.file) {
  //         // Access file data using req.file.buffer
  //         console.log('File received:', req.file);
  //       }
    
  //       // Check if the email already exists in the database
  //       const emailExistsQuery = 'SELECT COUNT(*) AS count FROM student WHERE email = ?';
  //       const emailExistsValues = [email];
    
  //       const [emailExistsResult] = await connection.promise().query(emailExistsQuery, emailExistsValues);
    
  //       if (emailExistsResult[0].count > 0) {
  //         console.log('Email already exists. Cannot add the same email again.');
  //         return res.status(400).json({ error: 'Email already exists' });
  //       }
    
  //       // Insert data into the "student" table
  //       const insertQuery = 'INSERT INTO student (first_name, email, gender, password, address, courses) VALUES (?, ?, ?, ?, ?, ?)';
  //       const insertValues = [firstName, email, gender, password, address, courses];
    
  //       const [insertResult] = await connection.promise().query(insertQuery, insertValues);
    
  //       console.log('Student added successfully!');
  //       return res.status(200).json({ message: 'Student added successfully!' });
    
  //     } catch (error) {
  //       console.error('Error adding student:', error.message);
  //       return res.status(500).json({ error: 'Internal Server Error' });
  //     }
  // }
  
  

  // const addstudent = (req, res) => {
  //   // Check if email already exists
  //   const checkEmailQuery = "SELECT COUNT(*) AS count FROM student WHERE email = ?";
  //   db.query(checkEmailQuery, [req.body.email], (emailCheckErr, emailCheckResults) => {
  //     if (emailCheckErr) {
  //       return res.status(500).send(emailCheckErr);
  //     }
  
  //     const emailCount = emailCheckResults[0].count;
  
  //     if (emailCount > 0) {
  //       // Email already exists, send a response indicating the conflict
  //       return res.status(409).send("Email already exists");
  //     }
  
  //     // Continue with insertion if email doesn't exist
  //     if (req.file) {
  //       console.log('File details:', {
  //         originalname: req.file.originalname,
  //         filename: req.file.filename,
  //         mimetype: req.file.mimetype,
  //         size: req.file.size,
  //       });
  //     } else {
  //       console.log('No file uploaded');
  //     }
  
  //     console.log('student data', req.body.firstName);
  
  //     const values = [
  //       req.body.ROLE_TYPE,
  //       req.body.firstName,
  //       req.body.email,
  //       req.body.password,
  //       req.body.gender,
  //       req.file.filename,
  //       req.body.address,
  //       req.body.courses
  //     ];
  //     const sql = "INSERT INTO student (`ROLE_TYPE`,`first_name`,`email`,`password`,`gender`,`profile`,`address`,`course`) VALUES (?)";
  
  //     db.query(sql, [values], (err, row) => {
  //       if (!err) {
  //         res.send(row);
  //       } else {
  //         res.status(500).send(err);
  //       }
  //     });
  //   });
  // };

  // ...........

  const addstudent = (req, res) => {
    // Check if email already exists
    const checkEmailQuery = "SELECT COUNT(*) AS count FROM student WHERE email = ?";
    db.query(checkEmailQuery, [req.body.email], (emailCheckErr, emailCheckResults) => {
      if (emailCheckErr) {
        return res.status(500).send(emailCheckErr);
      }
  
      const emailCount = emailCheckResults[0].count;
  
      if (emailCount > 0) {
        // Email already exists, send a response indicating the conflict
        return res.status(409).send("Email already exists");
      }
  
      // Continue with insertion if email doesn't exist
      if (!req.body.firstName) {
        return res.status(400).send("First Name is required");
      }
  
      if (!req.file) {
        return res.status(400).send("File should be uploaded");
      }
  
      console.log('File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
  
      console.log('student data', req.body.firstName);
      
      const { password } = req.body;
      const hashedpassword = bcryptjs.hashSync(password, 10);
      console.log('hash is applied...', hashedpassword);
  
      const values = [
        req.body.ROLE_TYPE,
        req.body.firstName,
        req.body.email,
        hashedpassword,
        req.body.gender,
        req.file ? req.file.filename : null,
        req.body.address,
        req.body.courses
      ];
  
      const sql = "INSERT INTO student (`ROLE_TYPE`,`first_name`,`email`,`password`,`gender`,`profile`,`address`,`course`) VALUES (?)";
  
      db.query(sql, [values], (err, row) => {
        if (!err) {
          res.send(row);
        } else {
          res.status(500).send(err);
        }
      });
    });
  };

  const addstaff = (req, res) => {
    // Check if email already exists
    const checkEmailQuery = "SELECT COUNT(*) AS count FROM staff WHERE email = ?";
    db.query(checkEmailQuery, [req.body.email], (emailCheckErr, emailCheckResults) => {
      if (emailCheckErr) {
        return res.status(500).send(emailCheckErr);
      }
  
      const emailCount = emailCheckResults[0].count;
  
      if (emailCount > 0) {
        // Email already exists, send a response indicating the conflict
        return res.status(409).send("Email already exists");
      }
  
      // Continue with insertion if email doesn't exist
      if (!req.body.firstName) {
        return res.status(400).send("First Name is required");
      }
  
      if (!req.file) {
        return res.status(400).send("File should be uploaded");
      }
  
      console.log('File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
  
      console.log('student data', req.body.firstName);
      
      const { password } = req.body;
      const hashedpassword = bcryptjs.hashSync(password, 10);
      console.log('hash is applied...', hashedpassword);
  
      const values = [
        req.body.ROLE_TYPE,
        req.body.firstName,
        req.body.email,
        hashedpassword,
        req.body.gender,
        req.file ? req.file.filename : null,
        req.body.address,
        req.body.courses
      ];
  
      const sql = "INSERT INTO staff (`ROLE_TYPE`,`first_name`,`email`,`password`,`gender`,`profile`,`address`,`course`) VALUES (?)";
  
      db.query(sql, [values], (err, row) => {
        if (!err) {
          res.send(row);
        } else {
          res.status(500).send(err);
        }
      });
    });
  };
  
  

export {
  updateprofile,
  admingetdeatils,
    adminlogin,
    addcourse,
    getcourse,
    getsinglecourse,
    updatecourse,
    deletecourse,
    addstudent,
    addstaff
}
 