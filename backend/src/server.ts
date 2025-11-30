
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance';

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO).then(()=> {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  }).catch(err => {
    console.error('Mongo connection error', err);
  });
} else {
  mongoose.connect(MONGO).then(()=> console.log('Connected to MongoDB (test mode)')).catch(err => console.error('Mongo connection error', err));
}

export default app;
