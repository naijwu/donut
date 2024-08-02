
import express from 'express'
import { auth } from '../middleware/auth.js';
import {
    createThread,
    updateThread,
    handleThreadReaction,
    getThreads
} from '../services/threadsService.js';

const router = express.Router();

router.post('/reaction/:threadID', auth, async(req, res) => {
    try {
        const { threadID } = req.params;

        /**
         * type ThreadReaction = {
         *    profile: string;
         *    emoji: string;
         * }
         */
        const { reaction } = req.body;

        // create a reaction
        await handleThreadReaction(threadID, reaction);

        res.status(200).json({
            message: 'Added reaction to thread'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating a reaction to ${threadID}`
        })
    }
})

router.get('/:donutID/:postOrder', auth, async (req, res) => {
    const { donutID, postOrder } = req.params;
    try {
        const data = await getThreads(donutID, postOrder);
        
        res.status(200).json({ data })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error getting thread for ${donutID}, ${postOrder}`
        })
    }
});

router.post('/:donutID/:postOrder', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;
        /**
         * type thread = {
         *    text: string;
         * }
         */
        const { thread } = req.body;

        // create thread
        await createThread(donutID, postOrder, thread);
        
        res.status(200).json({ 
            message: 'Successfully created comment'
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

export default router;