const Workout = require('../models/Workout');

const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
};

const createWorkout = async (req, res) => {
    const { exercise, duration, calories, date, notes } = req.body;
    if (!exercise || !duration || !calories) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const workout = await Workout.create({
        user: req.user._id,
        exercise,
        duration,
        calories,
        date,
        notes,
    });
    res.status(201).json(workout);
};

const updateWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWorkout);
};

const deleteWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    await workout.deleteOne();
    res.json({ message: 'Workout removed' });
};

module.exports = { getWorkouts, createWorkout, updateWorkout, deleteWorkout };
