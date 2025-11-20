const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    exercise: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    calories: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
