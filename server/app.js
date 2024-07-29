// Adapted from UBC cs department's node server tutorial

import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import demoRoute from './routes/demo.js';
import authRoute from './routes/auth.js';

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

// ----------------------------------------------------------
// Starting the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

