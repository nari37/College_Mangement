import express from 'express';
import mysql from 'mysql';
import Admin from './Routes/AdminRoute.js';
import staff from './Routes/StaffRoute.js';
import student from './Routes/StudentRoute.js';
import cors from 'cors'

 const app = express();
  app.use(cors());
  app.use(express.json());


const db = mysql.createConnection({
    password:'',
    host:'localhost',
    user:'root',
    database:'college_management'
})


 

db.connect((err)=>{
    if(!err){
        console.log('database connected successfully...');
    }   
        else{
            console.log('database not connected..');
        }
})



app.use('/backend/admin',Admin)
app.use('/backend/staff',staff)
app.use('/backend/student',student)





app.listen(8000,()=>{
    console.log('hello server is running on port...8000')
})


export default db;