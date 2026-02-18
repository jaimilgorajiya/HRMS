import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { verifyEmailConfig } from './utils/emailService.js';
import authRoutes from './routes/Auth.Routes.js';
import userRoutes from './routes/User.Routes.js';
import employmentTypeRoutes from './routes/EmploymentType.Routes.js';
import departmentRoutes from './routes/Department.Routes.js';
import uploadRoutes from './routes/Upload.Routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Verify email configuration on startup
verifyEmailConfig();

app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_URL,"http://localhost:5175",'http://localhost:5174', 'http://192.168.29.90:5175'], // Add your network IP explicitly
    credentials: true,
}));
app.use(cookieParser());
app.use('/uploads', express.static('public/uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employment-types', employmentTypeRoutes); 
app.use('/api/departments', departmentRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Client URL: ${process.env.CLIENT_URL}`);
});
