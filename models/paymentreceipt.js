const mongoose=require("mongoose")
const PaymentSchema=new mongoose.Schema(
      {
            "studentId":String,
            "studentName": String,
            "studentClass": String,
            "feeType": String,
            "feeAmount":String,
            "collegeId":String,
            "mobileNumber":String,// New field for mobile number
            "paymentid":String
            }
)
module.exports=mongoose.model("payment",PaymentSchema);