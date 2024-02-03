import { Request, Response } from 'express';
import { User } from '../models/user';
const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const router = express.Router();

const signUpSchema = zod.object({
	username: zod.string(),
	password: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
});

async function handleUserSignUp(req: Request, res: Response) {
	const { username, firstName, lastName, password } = req.body;

	const success = signUpSchema.safeParse(req.body);
	if (!success) {
		return res.json({
			message: 'Email already taken / Incorrect inputs',
		});
	}

	const user = User.findOne({
		username: username,
	});

	if (user._id) {
		return res.json({
			message: 'Email already taken / Incorrect inputs',
		});
	}

	const dbUser = await User.create(req.body);
	const token = jwt.sign(
		{
			userId: dbUser._id,
		},
		JWT_SECRET
	);
	res.json({
		message: 'User created successfully',
		token: token,
	});
}

router.post('/signup', handleUserSignUp);

module.exports = router;
