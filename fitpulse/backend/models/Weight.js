const mongoose = require('mongoose');

const weightSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    weight: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Weight', weightSchema);
