const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

/**
 *
 * Check if the user has correct token, if yes add the userId to req and move to exact logic
 * else return the error
 */
const authMiddleWare = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(403).json({});
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		red.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(403).json({});
	}
};

module.exports = {
	authMiddleWare,
};
