const { instance } = require('../App');

const checkout = async (req, resp) => {
    console.log('ejed')
    const options = {
        amount: Number(req.body.amount*100),
        currency: "INR"
    };
    
        const order = await instance.orders.create(options);
        console.log(order);
        // resp.send(order);
        resp.status(500).send({ 
            success:true,
            order});
};

module.exports = checkout;
