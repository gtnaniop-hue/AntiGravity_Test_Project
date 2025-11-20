const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, required: true, enum: ['weight', 'calories', 'workout_frequency'] },
    targetValue: { type: Number, required: true },
    deadline: { type: Date },
    isAchieved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
