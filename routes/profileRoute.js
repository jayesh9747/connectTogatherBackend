const express=require('express');
const profileRoute=express.Router();
const {handelDeleteAccount,handelUpdateProfileInfo,handelUpdateProfilePicture,handelUpdatePassword,getAllUserDetails,instructorDashboard}=require("../controllers/profile");
const {isAuth,isInstructor}=require("../middlewares/auth_middleware");
const {handelContactUs}=require("../controllers/contactUs");
profileRoute.delete("/deleteProfile",isAuth,handelDeleteAccount);//check
profileRoute.put("/updateProfile",isAuth,handelUpdateProfileInfo);//check
profileRoute.put("/updateProfilePicture",isAuth,handelUpdateProfilePicture);//check
profileRoute.post("/changepassword",isAuth,handelUpdatePassword);
//--------
profileRoute.get("/getUserDetails",isAuth,getAllUserDetails);//check
profileRoute.get("/instructorDashboard", isAuth,isInstructor,instructorDashboard);
//contact us
profileRoute.post("/contactUs",handelContactUs); 
module.exports=profileRoute;