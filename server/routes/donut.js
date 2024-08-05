
import express from 'express'
import { auth } from '../middleware/auth.js';
import { 
    getDonutsOfUser, 
    getDonut, 
    getDonutMessages, 
    sendDonutMessage 
} from '../services/donutService.js';

const router = express.Router();

router.get('/profile/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;

        // return all Donut + Profile(s) of a Profile
        const data = await getDonutsOfUser(email);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching all donuts where ${email} participates`
        })
    }
});

router.get('/:donutID', auth, async (req, res) => {
    try {
        const { donutID } = req.params;

        // select Donut + Profile(s)
        const data = await getDonut(donutID);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching donut ${donutID} with member profiles`
        })
    }
});

router.get('/groupchat/:donutID', auth, async (req, res) => {
    try {
        const { donutID } = req.params;

        // select all messages of this donutID
        const data = await getDonutMessages(donutID);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching messages of donut ${donutID}`
        })
    }
});

router.post('/:donutID/message', auth, async (req, res) => {
    try {
        const { donutID } = req.params;
        /**
         * type message = {
         *    messageID: string;
         *    donutID: string;
         *    message: string;
         *    sentAt: date;
         *    sender: string; 
         * }
         */
        const { message } = req.body;

        // Sends a message to the donut/groupchat
        await sendDonutMessage(donutID, message);
        
        res.status(200).json({
            message: 'Message successfully created'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error sending a message into ${donutID}`
        })
    }
});

export default router;