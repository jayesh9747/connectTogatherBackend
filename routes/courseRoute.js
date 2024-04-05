const express=require('express');
const {handelCreateCategory,handelFetchAllCategory,handelCategoryPage}=require("../controllers/category");
const {handelCreateLesson,handelLessonUpdate,handelLessonDelete}=require("../controllers/lesson");
const {handelCreateCourse,handelDisplayAllCourse,handelGetCourseDetail,handelEditCourse}=require("../controllers/course");
const {isAuth,isInstructor,isStudent}=require("../middlewares/auth_middleware");
const courseRoute=express.Router();
//category section
courseRoute.post("/createCategory",isAuth,handelCreateCategory);//check
courseRoute.get("/showAllCategories",handelFetchAllCategory);//check
courseRoute.get("/getCategoryPageDetails",handelCategoryPage);//check
//lesson routes
courseRoute.post("/addLesson",isAuth,isInstructor,handelCreateLesson);//check
courseRoute.post("/updateLesson",isAuth,isInstructor,handelLessonUpdate);//check
courseRoute.post("/deleteLesson",isAuth,isInstructor,handelLessonDelete);//check
//course section
courseRoute.post("/createCourse",isAuth,isInstructor,handelCreateCourse);//check
courseRoute.post("/editCourse",isAuth,isInstructor,handelEditCourse)// -------------------I have to make it
courseRoute.get("/getAllCourses",handelDisplayAllCourse);//check
courseRoute.post("/getCourseDetails",handelGetCourseDetail);//check
module.exports=courseRoute;