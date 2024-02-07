import express from 'express';
import { studentlogin } from '../controllers/student_control.js';



const student = express.Router();


student.post('/studentlogin', studentlogin)


export default student;