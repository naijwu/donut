
import express from 'express'
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {

        // return all from select Post, Donut, PostReaction
        const data = {}

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching all posts`
        })
    }
});

router.get('/:donutID/:postOrder', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;

        // select from Post, Donut, PostReaction, Thread, ThreadsReaction - return post + comments
        const data = {}

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching post ${donutID}, ${postOrder} with comments`
        })
    }
});

router.post('/:donutID', auth, async (req, res) => {
    try {
        const { donutID } = req.params;
        /**
         * type post = {
         *    donutID: string;
         *    title: string;
         *    postOrder: number;
         *    createdAt: date;
         *    author: string;
         * }
         */
        const { post } = req.body;

        // TODO: Insert data
        const newPost = {}
        
        res.status(200).json({
            data: newPost
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating post for ${donutID} with postOrder ${postOrder}`
        })
    }
});

router.patch('/:donutID/:postOrder', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;
        /**
         * type post = {
         *    donutID: string;
         *    title: string;
         *    postOrder: number;
         *    createdAt: date;
         *    author: string;
         * }
         */
        const { post } = req.body;

        // TODO: Edit data
        const editedPost = {}
        
        res.status(200).json({
            data: editedPost
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error updating post ${donutID}, ${postOrder}`
        })
    }
});

router.post('/:donutID/:postOrder/reaction', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;

        /**
         * type PostReaction = {
         *    profile: string;
         *    donutID: string;
         *    postOrder: number; 
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
            message: `Error creating a reaction to ${donutID}, ${postOrder}`
        })
    }
});

router.delete('/:donutID/:postOrder', auth, async(req, res) => {
    try {
        const { donutID, postOrder } = req.params;

        // TODO: Delete post

        res.status(200).json({
            message: 'Post deleted'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error deleting post ${donutID}, ${postOrder}`
        })
    }
})


export default router;