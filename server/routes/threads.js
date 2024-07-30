
import express from 'express'
import { auth } from '../middleware/auth.js';
import {
    createThread,
    updateThread,
    createThreadReaction
} from '../services/threadsService.js';

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

        // create thread
        const data  = await createThread(donutID, postOrder, thread);
        
        res.status(200).json({ data })
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
        const { thread } = req.body;

        // Update the thread
        const data = await updateThread(threadID, thread)
        
        res.status(200).json({ data })
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
        const data = await createThreadReaction(threadID, reaction);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating a reaction to ${threadID}`
        })
    }
})


export default router;