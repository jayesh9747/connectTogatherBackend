const mongoose=require('mongoose');
const Attendance=require("../models/Attendance");
async function markAttendance(req,res){
    try{
        const {grade,pStudent}=req.body;
        // console.log(grade,pStudent);
        if(!grade||pStudent.length==0){
            return res.status(400).json({
                 success:false,
                 message:"all details are not availabel",
            });
        }
        const today=new Date;
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are zero-based
        const day = today.getDate();
        const todaydate=day+"-"+month+"-"+year;
        // console.log(todaydate);
        const attendanceDb=await Attendance.create({date:todaydate,grade:grade});
        const updatedAttendance=await Attendance.findByIdAndUpdate(attendanceDb._id,{presence:pStudent},{new:true});
        // pStudent.forEach(async (ele)=>{
        //     await Attendance.findByIdAndUpdate(attendanceDb._id,{$push:{presence:ele}});
        // })
        // const updatedAttendance=await Attendance.findById(attendanceDb._id);
        return res.status(200).json({
            success:true,
            updatedAttendance,
        })
    }
    catch(err){
        console.log("Error in creating attendance", err.message);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
async function getAllAttendaceByClass(req,res){
    try{
        const {grade}=req.body;
        if(!grade){
            return res.status(400).json({
                success:false,
                message:"Class Id is not present",
            })
        }
        const dbResponse=await Attendance.find({grade:grade});
        // console.log(dbResponse);
        return res.status(200).json({
            success:true,
            dbResponse,
        })
    }
    catch(err){
        console.log(err);
    }
}
async function getAttendanceByDate(req,res){
    try{
        const {date,grade}=req.body;
        const attendance=await Attendance.find({date:date,grade:grade});
        return res.status(200).json({
            success:true,
            data:attendance
        })


    }catch(error){
        console.log(error);
    }
}

// async function createAttendance(req,res){
//     try{
//         const {date,grade,presence}=req.body;
//         if(!grade||!date){
//             return res.status(400).json({
//                 success:false,
//                 message:"all details are not availabel",
//             })
//         }
//         const attendanceDb=await Attendance.create({grade:grade,date:date});
//         return res.status(400).json({
//             success:false,
//             message:"Attendance forum have been created successfully",
//         })
//     }
//     catch(err){
//         console.log("error in creating attendace", err);
//         return res.status(500).json({
//             success:false,
//             message:err.message,
//         })
//     }
// };
// async function markAttendance(req,res){
//     try{
//         const {attendanceId,rollnumber}=req.body;
//         if(!attendanceId||!rollnumber){
//             return res.status(400).json({
//                 success:false,
//                 message:"all details are not availabel",
//             })
//         }
//         const attendanceDb=await Attendance.findByIdAndUpdate({attendanceId},{$push:{presence:{rollnumber:rollnumber,present:true}}});
//         return res.status(200).json({
//             success:true,
//             message:"Attendance marked successfully",
//         })
//     }
//     catch(err){
//         console.log("error in marking attendance",err);
//         return res.status(500).json({
//             success:false,
//             message:err.message,
//         })
//     }
// };

module.exports={ markAttendance,getAllAttendaceByClass,getAttendanceByDate};