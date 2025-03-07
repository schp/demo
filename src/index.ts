import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { router } from "./api";
import { initializePool } from "./utils";
import bodyParser from "body-parser";
import { initializeService } from "./service";

dotenv.config({ path: '.env' });

initializePool();
initializeService();

const app = express();
const port = parseInt(process.env.PORT ?? '3000');

app.use(bodyParser.json());
app.use('/api', router);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('An internal error has occurred');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
