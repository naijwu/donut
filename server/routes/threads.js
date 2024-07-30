
import express from 'express'
import { auth } from '../middleware/auth.js';
import axios from 'axios'
import jwt from 'jsonwebtoken'
import queryString from 'query-string'

const router = express.Router();

router.post('/:donutID/:postOrder', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;
        /**
         * type thread = {
         *    profile: string;
         *    threadID: string;
         *    emoji: string;
         * }
         */
        const { thread } = req.body;

        // TODO: Insert data
        const query = {}
        
        res.status(200).json({
            message: `Successfully added thread of ${thread.threadID} to ${donutID}, ${postOrder}`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating thread for ${donutID}, ${postOrder}`
        })
    }
});

router.patch('/:threadID', auth, async (req, res) => {
    try {
        const { threadID } = req.params;

        // TODO: Update comment
        const query = {}
        
        res.status(200).json({
            message: `Successfully updated thread ${threadID}`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error updating thread ${threadID}`
        })
    }
});

router.post('/:threadID/reaction', auth, async(req, res) => {
    try {
        const { threadID } = req.params;

        /**
         * type ThreadReaction = {
         *    profile: string;
         *    threadID: string;
         *    emoji: string;
         * }
         */
        const { reaction } = req.body;

        // create a reaction
        const data = {}

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating a reaction to ${threadID}`
        })
    }
})


export default router;