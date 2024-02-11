const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		requires: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const User = mongoose.model('User', userSchema);
