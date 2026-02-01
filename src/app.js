import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import authRoutes from './modules/auth/auth.routes.js';
import  errorHandler  from './common/middlewares/errorHandler.js';
import groupRoutes from './modules/groups/group.routes.js';
import extractorRoutes from './modules/extractor/extractor.routes.js';
import summarizerRoutes from './modules/summarizer/summarizer.router.js';
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
// app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);
app.use('/api/auth',authRoutes);
app.use('/api/groups',groupRoutes);
app.use('/api/extractor',extractorRoutes);
app.use('/api/summarizer',summarizerRoutes);

app.use(errorHandler);

export default app;
