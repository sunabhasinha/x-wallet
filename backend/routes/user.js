import { User } from '../models/user';
const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const router = express.Router();
const { authMiddleWare } = require('../middleware');

const signUpSchema = zod.object({
	username: zod.string(),
	password: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
});

async function handleUserSignUp(req, res) {
	const { username } = req.body;

	const success = signUpSchema.safeParse(req.body);
	if (!success) {
		return res.json({
			message: 'Email already taken / Incorrect inputs',
		});
	}

	const user = User.findOne({
		username: username,
	});

	if (!user._id) {
		return res.json({
			message: 'No user found',
		});
	}
	const userData = {
		...req.body,
		balance: Math.floor(Math.random() * 10000) + 1,
	};
	const dbUser = await User.create(userData);
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

async function handleUserUpdate(req, res) {
	const { username, firstName, lastName, password } = req.body;
	const success = signUpSchema.safeParse(req.body);
	if (!success) {
		return res.json({
			message: 'Email already taken / Incorrect inputs',
		});
	}

	try {
		const user = await User.findOne({
			username: username,
		});

		if (!user._id) {
			return res.json({
				message: 'User not found',
			});
		}

		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{
				firstName,
				lastName,
				password,
			},
			{ new: true }
		);

		res.status(200).json({
			message: 'User updated successfully',
			user: updatedUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal server error',
		});
	}
}

async function handleUserFetch() {
	const filter = req.query.filter;
	try {
		const users = User.find({
			$or: [
				{
					firstName: {
						$regex: filter,
					},
				},
				{
					lastName: {
						$regex: filter,
					},
				},
			],
		});

		res.status(200).json({
			user: users.map((user) => ({
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				_id: user._id,
			})),
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal server error',
		});
	}
}

router.post('/signup', handleUserSignUp);
router.put('/', authMiddleWare, handleUserUpdate);
router.get('/bulk', handleUserFetch);

module.exports = router;
