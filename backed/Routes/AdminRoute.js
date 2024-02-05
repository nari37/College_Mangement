import express from 'express';
import {addcourse, addstudent, adminlogin} from '../controllers/admin_control.js';
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
Admin.post('/addcourse',addcourse)
Admin.get('/getcourse', getcourse)
Admin.get('/singlecourse/:courseid',getsinglecourse)
Admin.post('/editcourse/:editcourseid', updatecourse);
Admin.post('/deletecourse/:id', deletecourse);
Admin.post('/adminupdateprofile', updateprofile);
Admin.post('/addstudent', upload.single('file'), addstudent);









export default Admin;