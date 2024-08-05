// Adapted from UBC cs department's node server tutorial

import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import ws, { WebSocketServer } from 'ws'

// import demoRoute from './routes/demo.js';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import donutRoute from './routes/donut.js';
import postRoute from './routes/post.js';
import threadsRoute from './routes/threads.js';
import notificationsRoute from './routes/notifications.js'
import queryRoute from './routes/query.js';
import exploreRoute from './routes/explore.js'


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

// app.use('/', demoRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/donut', donutRoute);
app.use('/post', postRoute);
app.use('/threads', threadsRoute);
app.use('/notifications', notificationsRoute);
app.use('/query', queryRoute);
app.use('/explore', exploreRoute);

// ----------------------------------------------------------
// Starting the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Websocket server running at wss://localhost:${WS_PORT}/`);
});

// Start WebSocket server
const WS_PORT = process.env.WS_PORT || 8080;

const wss = new WebSocketServer({ port: WS_PORT })
// WebSocket event handling
wss.on('connection', (ws) => {
    // console.log('A new client connected.');
  
    // Event listener for incoming messages
    ws.on('message', (message) => {
    //   console.log('Received message:', message.toString());
      // message is stringified before being sent
  
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    });
  
    // Event listener for client disconnection
    ws.on('close', () => {
    //   console.log('A client disconnected.');
    });
});
