import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';

// Config
import corsOptions from '@shared/infra/http/corsOptions';

// Routes
import appRoutes from './routes';

import '@shared/infra/mongoose';
import '@shared/container';

// Initial server configuration
const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(appRoutes);

export default app;
