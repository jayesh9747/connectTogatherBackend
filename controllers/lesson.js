const Course=require("../models/Course");
const Lesson=require("../models/Lesson");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
//creating section
async function handelCreateLesson(req,res){
    try{
        //CourseId is the is of the course in which we want to add aLesson
        const {lessonName,description,courseId}=req.body;
        const videoFile=req.files.file;
        if(!lessonName||!courseId){
            return res.status(400).json({ 
                success:false,
                message:"All fields are required",
            });
        }
        //creating a Lesson
        const cloudinaryResponse=await uploadImageToCloudinary(videoFile,process.env.CLOUDINARY_FOLDER);
        const thumbnailLink=String(cloudinaryResponse.secure_url);
        const LessonDb=await Lesson.create({lessonName:lessonName,description:description,videoFile:thumbnailLink});
        //add creatd Lesson id to the parent Course
        const updatedCourse=await Course.findByIdAndUpdate(courseId,{$push:{lesson:LessonDb._id,}},{new:true}).populate("lesson").exec();
        return res.status(200).json({
            success:true,
            message:"Lesson is created successfull in invoking course",
            updatedCourse,
        })

    }catch(err){
        console.log("Error in creating a Lesson");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
//updating Lesson (here Lesson name is updated)
async function handelLessonUpdate(req,res){
    try{
        //here Lesson name is the name that we want to update
        const {lessonName,LessonId}=req.body;
        if(!lessonName||!LessonId){
            return res.status(400).json({
                success:false,
                message:"Complete All fields"
            })
        }
        const updatedLesson=await Lesson.findByIdAndUpdate(LessonId,{lessonName:lessonName},{new:true});
        return res.status(200).json({
            success:true,
            message:"Lesson name is updates successfully",
            updatedLesson
        })
    }catch(err){
        console.log("Error in updating setion name");
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}
//deleting a Lesson
async function handelLessonDelete(req,res){
    try{
        //we require course id so that after deleting a Lesson repective id should be deleted form the course in which it is registered
        const {lessonId,courseId}=req.body;
        if(!lessonId||!courseId){
            return res.status(400).json({
                success:false,
                message:"Complete All fields"
            })
        }
        //deleting Lesson
        await Lesson.findByIdAndDelete(lessonId);
        //deleting the Lesson id from Course
        await Course.findByIdAndUpdate(courseId,{$pull:{lesson:lessonId}});
        return res.status(200).json({
            success:true,
            message:"Lesson name is deleted successfully",
        })
    }catch(err){
        console.log("Error in deleting setion name");
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}
module.exports={handelCreateLesson,handelLessonUpdate,handelLessonDelete}; 