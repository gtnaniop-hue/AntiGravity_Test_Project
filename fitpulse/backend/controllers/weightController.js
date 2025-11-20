const Weight = require('../models/Weight');

const getWeightHistory = async (req, res) => {
    const history = await Weight.find({ user: req.user._id }).sort({ date: 1 });
    res.json(history);
};

const addWeight = async (req, res) => {
    const { weight, date } = req.body;
    if (!weight) return res.status(400).json({ message: 'Please add weight' });
    const entry = await Weight.create({
        user: req.user._id,
        weight,
        date,
    });
    res.status(201).json(entry);
};

module.exports = { getWeightHistory, addWeight };
