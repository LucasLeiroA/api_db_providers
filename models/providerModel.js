// backend/models/providerModel.js
const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: String,
    contact_info: {
        email: String,
        phone: String
    },
    total_debt: { type: Number, default: 0 },
    total_payments: { type: Number, default: 0 },
    debt_details: [
        {
            amount: Number,
            date: Date,
            description: String
        }
    ],
    payment_details: [
        {
            amount: Number,
            date: Date,
            description: String
        }
    ]
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
