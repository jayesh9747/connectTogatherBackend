const express=require('express');
const {handelAskDoubt,handelGetUserDoubt} =require("../controllers/doubt");
const {isAuth,isStudent, isInstructor} =require("../middlewares/auth_middleware");
const myRoutes=express.Router();
myRoutes.post("/create-doubt",isAuth,isStudent,handelAskDoubt);
myRoutes.post("/getUserDoubt",handelGetUserDoubt);
myRoutes.post("/create-notification",);
// myRoutes.post("")
module.exports=myRoutes;