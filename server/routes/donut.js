
import express from 'express'
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;

        // return all Donut + Profile of a user
        const data = {}

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

        // select Donut + Profile
        const data = {}

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching donut ${donutID} with member profiles`
        })
    }
});

router.get('/:donutID/messages', auth, async (req, res) => {
    try {
        const { donutID } = req.params;

        // select all messages of this donutID
        const data = {}

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

        // TODO: Insert data
        const newMessage = {}
        
        res.status(200).json({
            data: newMessage
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error sending a message into ${donutID}`
        })
    }
});

export default router;