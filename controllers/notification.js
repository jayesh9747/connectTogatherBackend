const Notification=require("../models/Notification")
const Instructor=require("../models/Instructor")
const Student=require("../models/Student")
const Doubt=require("../models/Doubt")

exports.sendNotification=async (req,res)=>{
    try{
        const {userId,doubtId,grade}=req.body;
        if(!userId||!doubtId||!grade){
            return res.status(500).json({
                success:false,
                message:"All fields are necessary"
            })
        }
        const instructors = await Instructor.find({ std: grade });

        const notificationPromises = instructors.map(async (instructor) => {
            const notification = new Notification({
                userId: userId, // Assuming you have the student's ID in the request
                instructorId: instructor.instructorId,
                doubtId: doubtId
            });
            return notification.save();
        });

        await Promise.all(notificationPromises);
        res.status(201).json({ success: true, message: "Notifications sent successfully" });


    }catch(error){
        console.error("Error sending notifications:", err);
        res.status(500).json({ success: false, message: "Failed to send notifications" });
    }
}

exports.getNotificationsByInstructorId = async (req, res) => {
    try {
        const { instructorId } = req.body;
        const notifications = await Notification.find({ teacherId: instructorId });
        res.status(200).json({ success: true, notifications: notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};