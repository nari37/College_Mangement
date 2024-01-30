import express from 'express';
import login from '../controllers/student_control.js';



const student = express.Router();


student.post('/login',login)


export default student;