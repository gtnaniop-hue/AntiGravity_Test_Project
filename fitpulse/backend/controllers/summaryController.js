const Workout = require('../models/Workout');

const getSummary = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
        user: req.user._id,
        date: { $gte: today },
    });

    const totalCalories = workouts.reduce((acc, curr) => acc + curr.calories, 0);
    const totalDuration = workouts.reduce((acc, curr) => acc + curr.duration, 0);

    res.json({
        totalCalories,
        totalDuration,
        workoutCount: workouts.length,
    });
};

const getWeeklySummary = async (req, res) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
        user: req.user._id,
        date: { $gte: startOfWeek }
    });

    const totalCalories = workouts.reduce((acc, curr) => acc + curr.calories, 0);
    const totalDuration = workouts.reduce((acc, curr) => acc + curr.duration, 0);

    res.json({
        totalCalories,
        totalDuration,
        workoutCount: workouts.length,
        workouts
    });
};

module.exports = { getSummary, getWeeklySummary };
