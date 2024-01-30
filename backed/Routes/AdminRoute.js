import express from 'express';
import {addcourse} from '../controllers/admin_control.js';
import {getcourse} from '../controllers/admin_control.js';
import {getsinglecourse} from '../controllers/admin_control.js';
import {updatecourse} from '../controllers/admin_control.js';
import {deletecourse} from '../controllers/admin_control.js';
import {updateprofile} from '../controllers/admin_control.js';








const Admin = express.Router();

Admin.post('/addcourse',addcourse)
Admin.get('/getcourses',getcourse)
Admin.get('/singlecourse/:courseid',getsinglecourse)
Admin.post('/editcourse/:editcourseid', updatecourse);
Admin.post('/deletecourse/:id', deletecourse);
Admin.post('/adminupdateprofile', updateprofile);








export default Admin;