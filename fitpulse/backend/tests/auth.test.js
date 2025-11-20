const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock Mongoose models BEFORE importing routes
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    schema: {
        methods: {
            matchPassword: jest.fn()
        }
    }
}));

// Mock bcryptjs to avoid actual hashing
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashedpassword'),
    compare: jest.fn().mockResolvedValue(true),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocktoken'),
}));

describe('Auth API', () => {
    let User;

    beforeAll(() => {
        User = require('../models/User');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token', 'mocktoken');
    });

    it('should login a user', async () => {
        const mockUser = {
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
            matchPassword: jest.fn().mockResolvedValue(true)
        };
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token', 'mocktoken');
    });
});
