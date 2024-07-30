// Adapted from UBC cs department's node server tutorial

import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import demoRoute from './routes/demo.js';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import donutRoute from './routes/donut.js';
import postRoute from './routes/post.js';
import threadsRoute from './routes/threads.js';
import notificationsRoute from './routes/notifications.js'
import queryRoute from './routes/query.js';

const app = express();
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        // process.env.CLIENT_URL_WWW
    ],
    credentials: true
}));

app.use(cookieParser());

app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads

app.use('/', demoRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/donut', donutRoute);
app.use('/post', postRoute);
app.use('/threads', threadsRoute);
app.use('/notifications', notificationsRoute);
app.use('/query', queryRoute);

// ----------------------------------------------------------
// Starting the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

