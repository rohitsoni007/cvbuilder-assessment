const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        type: {
            type: String
        },
        amount: {
            type: Number
        },
        status: {
            type: String
        },
        paymentStatus: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        
    },
    { timestamps: true }
);






const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
