import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import corsOptions from '@shared/infra/http/corsOptions';
import '@shared/infra/mongoose';
import '@shared/infra/container';
import '@shared/container';

import appRoutes from './routes';

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(appRoutes);

export default app;
