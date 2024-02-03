import express, { Request, Response } from 'express';
const cors = require('cors');
const rootRouter = require('./routes/index');

const app = express();
const port = 3000;

app.use('/api/v1', rootRouter);
app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
