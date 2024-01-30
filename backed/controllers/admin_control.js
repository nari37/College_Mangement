import db from "../index.js";




const updateprofile = (req,res)=>{
  const {data} = req.body;
  console.log(data)
}

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
      const sql = 'SELECT * FROM course';
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

  const addstudent = (req,res) => {

  }
  
  
  

export {
  updateprofile,
    addcourse,
    getcourse,
    getsinglecourse,
    updatecourse,
    deletecourse,
    addstudent
}
 