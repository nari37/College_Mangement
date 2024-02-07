import express from 'express';
import {addcourse, addstaff, addstudent, admingetdeatils, adminlogin} from '../controllers/admin_control.js';
import {getcourse} from '../controllers/admin_control.js';
import {getsinglecourse} from '../controllers/admin_control.js';
import {updatecourse} from '../controllers/admin_control.js';
import {deletecourse} from '../controllers/admin_control.js';
import {updateprofile} from '../controllers/admin_control.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/files");
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage,
  
});





const Admin = express.Router();


Admin.post('/adminlogin',adminlogin)
Admin.get('/getadmindetails',admingetdeatils)
Admin.post('/addcourse',addcourse)
Admin.get('/getcourse', getcourse)
Admin.get('/singlecourse/:courseid',getsinglecourse)
Admin.post('/editcourse/:editcourseid', updatecourse);
Admin.post('/deletecourse/:id', deletecourse);
Admin.post('/adminupdateprofile',upload.single('file'), updateprofile);
Admin.post('/addstudent', upload.single('file'), addstudent);
Admin.post('/addstaff', upload.single('file'), addstaff);










export default Admin;