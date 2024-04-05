const express = require('express');
const router = express.Router();
const checkout  =require('../controllers/paymentcontroller')
router.post('/checkout', checkout);
// router.get('/checkout', (req,resp)=>{
//       console.log("called");
//       resp.send({message:"datafrom dasflj"})
// });


module.exports = router;
