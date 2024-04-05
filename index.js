const express=require('express');
const http=require('http');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const {dbConnect}=require("./config/database");
const {cloudinaryConnect}=require("./config/cloudinary");
const Class=require("./models/Class");
const app=express();
require('dotenv').config();
// const server=http.createServer(app);
// const {Server}=require('socket.io');
const authRoute=require("./routes/authRoute");
const profileRoute=require("./routes/profileRoute");
const courseRoute=require("./routes/courseRoute");
const myRoutes=require("./routes/myroutes");
//other routes
const otherRoutes=require("./routes/otherRoute");
const fileUpload=require("express-fileupload");
// const io=new Server(server,{
//     cors:{
//         origin:`http://localhost:${process.env.FRONTEND_PORT}`,
//         credentials:true,
//     }
// });
console.log(process.env.FRONTEND_PORT);
app.use(cors({
    origin:`http://localhost:3000`,
    credentials:true,
}))


// ====================

// ============
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(fileUpload(
    {useTempFiles:true,
    tempFileDir:'/tmp/'} 
    ));
dbConnect();
cloudinaryConnect();
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/doubt",myRoutes);
app.use("/api/v1/other",otherRoutes);

app.get("/",(req,res)=>{
    return res.send("Welcome to my backend Page");
});

// 
app.post("/api/v1/create-class",async (req,res)=>{
    try{
        const {grade}=req.body;
        const classDb=await Class.create({grade:grade});
    }
    catch(err){
        console.log(err);
    }
})


// =======================================================
const CalenderModel=require('./models/Calender')
const Blogmodel=require('./models/Blog')
const TestModel=require('./models/Test')
const testScoreModel=require('./models/TestScore')
// const meeting=require('./router/meeting')
const MeetingModel=require('./models/Meeting');
const paymentModel=require('./models/paymentreceipt')





app.get("/blog",async(req,resp)=>{
    // resp.send("fuck you");
          const data=await Blogmodel.find({});
          resp.send(data);
    })
    
    
    // ========================
    const RAZORPAY_API_KEY = process.env.RAZORPAY_API_KEY;
    const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;
    
    const Razorpay = require('razorpay');
    var crypto = require("crypto");
    const instance = new Razorpay({
        key_id: RAZORPAY_API_KEY,
        key_secret: RAZORPAY_SECRET_KEY,
      });
    app.post('/checkout', async (req,resp)=>{
        const {studentId,
        studentName,
        studentClass,
        feeType,
        feeAmount,
        collegeId,
        mobileNumber} =req.body
        var options = {
          amount: feeAmount*100,  // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11"
        };
        const data=instance.orders.create(options,async function (err, order) {
          console.log(order);
          console.log(data);
          // console.log(window);
        //   update db 
        await paymentModel.create({
            studentId,
        studentName,
        studentClass,
        feeType,
        feeAmount,
        collegeId,
        mobileNumber,
        paymentid:order.razorpay_payment_id
        });
        resp.send(order);
        });
    
        // 
      });
    
    app.post('/paymentverification',async (req,resp)=>{
        console.log(req.body);
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
        const body=razorpay_order_id+ "|" +razorpay_payment_id;
        
        
        const expectedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET_KEY)
                                        .update(body.toString())
                                        .digest('hex');
                                        console.log("sig received " ,razorpay_signature);
                                        console.log("sig generated " ,expectedSignature);
        
        const isAuthentic=expectedSignature === razorpay_signature
        if(isAuthentic){
        // databse come here
        
        // await paymentModel.create({
        //   razorpay_order_id,
        //   razorpay_payment_id,
        //   razorpay_signature
        // })
        
        resp.redirect(`${process.env.FRONTEND_URL}/paymentsucess?reference=${razorpay_payment_id}`)
        // resp.send({...req.body,reference:razorpay_payment_id})
        }
        else{
          resp.status(200).json({
            success:false,
          })
        }
            // resp.send(response);
        
        })
    app.get('/getkey',(req,resp)=>{
            resp.status(200).json({key:process.env.RAZORPAY_API_KEY})
        });
    app.get('/paymentdetails/:pid',async(req,resp)=>{
        console.log("hello hello");
        const id = req.params.pid;
        console.log(id)
        const data=await paymentModel.find({studentId:id});
        resp.send(data);
        paymentModel.find({})
    })
    // =================
    const multer = require('multer');
    const xlsx = require('xlsx');
    const upload = multer({ dest: 'uploads/' });
    app.get('/ilikes/:Number', async(req, resp) => {
        const id = req.params.Number; // Extracting the value of the 'Number' parameter from the URL
        console.log(id);
    
        const data=await Blogmodel.find({Number:id});
        // console.log(data);
        const {LikeCount}=data[0];
        // console.log("LikeCount",LikeCount);
        await Blogmodel.updateOne(
            { Number: id }, // Filter: Find the document where 'numberField' equals 'number'
            { $set: { LikeCount: LikeCount+1 } } // Update: Increment 'countField' by 1
        )
        resp.send({ status: true }); // Sending a response back to the client
    });
    app.get('/dlikes/:Number',async(req,resp)=>{
    
        const id = req.params.Number; // Extracting the value of the 'Number' parameter from the URL
        
        const data=await Blogmodel.find({Number:id});
        // console.log(data);
        const {LikeCount}=data[0];
        // console.log("LikeCount",LikeCount);
        await Blogmodel.updateOne(
            { Number: id }, // Filter: Find the document where 'numberField' equals 'number'
            { $set: { LikeCount: LikeCount-1 } } // Update: Increment 'countField' by 1
        )// Logging the value of the parameter to the console
        resp.send({ status: true }); //
    })
    app.post('/fileupload',upload.single('file'), (req, res) => {
        const filePath = req.file.path;
      console.log("called");
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
      
        // Now you have 'data', you can store it in MongoDB using Mongoose or any other MongoDB library
    
        console.log(data);
    
    
        data.forEach(async(da)=>{
            await CalenderModel.create(da);
        })
      
        res.send('File uploaded and processed successfully');
      });
    app.get('/calender',async (req,resp)=>{
        const data=await CalenderModel.find({});
        resp.send(data);
    })
    
    app.get('/testquestion',async(req,resp)=>{
          const data=await TestModel.find({});
          resp.send(data);
    })
    
    app.post('/quizresult',async(req,resp)=>{
          const data=req.body;
          console.log(req.body);
          const resposne=new testScoreModel(req.body);
          resposne.save();
          resp.send({status:true});
    })
    
    app.get('/getscore/:studentid',async(req,resp)=>{
    const studentid=req.params.studentid;
    // console.log(studentid)
    // console.log()
    // studentid:studentid
    const data=await testScoreModel.find({Studentid:studentid});
    // console.log(data);
    resp.send(data)
    
    })
    
    // ===================meeting code:
    
    //creating meeting 
    app.post('/create', async (req, res) => {
        try {
            console.log(req.body) ;   
            const { title, description, date, time, teacherId, student, g_meet } = req.body;
            console.log(title,description,date,time,teacherId,student);
            // Create a new meeting
            // const meeting ={
            //     title: title,
            //     description: description,
            //     date: date,
            //     time: time,
            //     teacherId: teacherId,
            //     student: student,
            //     g_meet: g_meet
            // };
            // console.log(meeting);
            const response = await MeetingModel.create({
                title: title,
                description: description,
                date: date,
                time: time,
                g_meet: g_meet
            });
            console.log("hello sir",response);
            res.send(response);
    
            // Send the created meeting as a response
            // res.status(201).json({ response });
        } catch (error) {
            // If there's an error, send an error response
            res.status(500).json({ error: error.message });
        }
    });
      
    
    //get all meeting created by its classroom teacher
    app.get('/scheduledMeeting', async (req, res) => {
          try {
              const {teacherId} = req.body;
              const response =await MeetingModel.find({});
      
              //filter all the meeting which created by teacher 
              res.send(response);
    
          } catch (error) {
              // If there's an error, send an error response
              res.status(500).json({ error: error.message });
          }
      });



// ==========================================================
// app.post("/api/v1/addrole",async (req,res)=>{
//     try{
//         const {grade,rollnumber}=req.body;
//         const classDb=await Class.findOneAndUpdate({grade:grade},{$push:{rollnumber:rollnumber}});
//         return res.status(200).json({
//             message:"Updated successfully",
//         })
//     }
//     catch(err){
//         console.log(err);
//     }
// })
// 
// ========================
const server =app.listen(process.env.BACKEND_PORT,()=>{
    console.log(`Server is running successfully:${process.env.BACKEND_PORT}`);
})
const socketIO = require('./socketio'); // Import the socket.js file
socketIO.initSocket(server);

// ===============================================
// room createion


app.get("/hi",(req,resp)=>{
    resp.send({message:"gello"})
})
const chatModel=require("./models/Model");
const roomModel=require("./models/ModelCreateRoom");
const {uploadImageToCloudinary}=require("./utils/imageUploader");
app.get("/roomcreate/:roomname",async(req,resp)=>{
    const roomname=req.params.roomname;
    let data=await roomModel.find({room:roomname});
    if(data.length>0){
          return resp.send({status:false,
          message:"Same Room Name already exist"});
    }
    
    const roommodel=new roomModel({room:roomname});
    data=await roommodel.save();
    console.log(data);
    // resp.send(data);
    resp.send({status:true,
    message:"room created "});
    })
    app.get("/rooms",async(req,resp)=>{
    const roommodel=await roomModel.find({});
    resp.send(roommodel);
    })
    app.get('/getchat/:room',async(req,resp)=>{
          try {
                console.log("accessing chat of room ",req.params.room);
                const messages = await chatModel.find({room:req.params.room}); 
                const frontendData = messages.map(item => ({ ...item._doc, _id: item._id.toString() }));      
                resp.send(frontendData);
                } catch (error) {
                resp.status(500).send({ error: 'Internal Server Error' });
          }
    });

//     const storage=multer.diskStorage({
//         destination:(req,file,cb)=>{
//         cb(null,'Images');
//         },
//         filename:(req,file,cb)=>{
//         cb(null,Date.now()+path.extname(file.originalname))
//         }
//   });
//   const upload=multer({storage:storage});

console.log( "Hello",process.env.FRONTEND_PORT ) 

  app.post("/upload",async(req,resp)=>{
    console.log("file uploading",req.files.image)
        const  file=req.files.image;
        const cdResponse= await uploadImageToCloudinary(file,"menty");
        const imageurl=cdResponse.secure_url;
        const replyingto=req.body.replyingto==="null"?null:req.body.replyingto;
        const replyingmsg=req.body.replyingmsg==="null"?null:req.body.replyingmsg;
        const chat={
              msgtype:req.body.msgtype,
              imagename:imageurl,
              user:req.body.user,
              message:req.body.message,
              room:req.body.room,
              replyingto:replyingto,
              replyingmsg:replyingmsg,
              chatID:Date.now()+req.body.user
        }
  
        const data= new chatModel(chat);
        data.save();
        // io.to(req.body.room).emit("message", chat);
        socketIO.emitMessage(req.body.room,chat);
        resp.send({message:"data send",status:true});
  })
// ===============================================








   