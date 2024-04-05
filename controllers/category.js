const Category=require("../models/Category");
const Course=require("../models/Course");
//function to create categorys
async function handelCreateCategory(req,res){
    try{
        const {name,description}=req.body;
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
                //creating category entry in db
        const categoryDb=await Category.create({name:name,description:description});
        console.log("Created category is",categoryDb); 
        return res.status(200).json({
            success:true,
            message:"category is created successfullt",
            categoryDb,
        })

    }catch(err){
        console.log("Error in creating category");
        return res.status(400).json({
            success:true,
            message:err.message,   
        })
    }
}
//fucntion to fetch all categorys
async function handelFetchAllCategory(req,res){
    try{
        const categories=await Category.find({});
        return res.status(200).json({
            success:true,
            message:"category are fetched successfully",
            categories,
        })
    }catch(err){
        console.log("Error in fetching all categorys");
        return res.status(500).json({
            success:false,
            message:err,
        })
    }
}
//creating cateorgy pages handler fucniton
async function handelCategoryPage(req,res){
    try{
        const {categoryId}=req.body;
        console.log(categoryId);
        //courses with selected category(found using populate)
        const category=await Category.findById(categoryId).populate("courses").exec();
        if(!category){
            return res.status(400).json({
                success:false,
                message:`Courses width given category are not present`,
                data:{},
            })
        }
        //courses with different selected categories
        const notCategory=await Category.find({_id:{$ne:categoryId}}).populate("courses").exec();
        //most bough courses
        return res.status(200).json({
            success:true,
            message:"Top 10 courses with most enrolled strudent are here",
            data:{
                category,
                notCategory
            }
        })
    }catch(err){
        console.log("Error in getting courses with category");
        return res.statsu(500).json({
            success:false,
            message:err.message 
        })
    }
}
module.exports={handelCreateCategory,handelFetchAllCategory,handelCategoryPage};