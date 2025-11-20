const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
};

const createGoal = async (req, res) => {
    const { type, targetValue, deadline } = req.body;
    if (!type || !targetValue) {
        return res.status(400).json({ message: 'Please add type and target value' });
    }
    const goal = await Goal.create({
        user: req.user._id,
        type,
        targetValue,
        deadline,
    });
    res.status(201).json(goal);
};

const updateGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGoal);
};

module.exports = { getGoals, createGoal, updateGoal };
