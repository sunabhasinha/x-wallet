const express = require('express');
const router = express.Router();
const { authMiddleWare } = require('../middleware');
const { Account } = require('../models/accounts');
async function fetchUserBalance(req, res) {
	const { userId } = req;
	if (!userId) {
		res.status(411).json({
			message: 'user is not authenticated',
		});
	}

	const account = await Account.findById(userId);
	if (!account) {
		res.status(411).json({
			message: `user's account not found`,
		});
	}
	res.status(200).json({
		balance: account.balance,
	});
}

async function handleTransfer(req, res) {
	const { to, amount } = req.body;
	//TODO
}

router.get('/balance', authMiddleWare, fetchUserBalance);
router.post('/transfer', authMiddleWare, handleTransfer);

module.exports = router;
