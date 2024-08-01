
import express from 'express'
import { auth } from '../middleware/auth.js';
import {
    getAllPosts,
    getDonutPost,
    createPost,
    updatePost,
    createPostReaction,
    deletePost,
    getProfileDonutPost
} from '../services/postService.js';
import multer from 'multer'

const router = express.Router();

// for handling the images
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
});

router.get('/', auth, async (req, res) => {
    try {

        // return all from select Post, Donut, PostReaction
        const data = await getAllPosts();

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching all posts`
        })
    }
});

router.get('/donut/:donutID/order/:postOrder', auth, async (req, res) => {
    try {
        const { donutID, postOrder } = req.params;

        // select from Post, Donut, PostReaction, Thread, ThreadsReaction - return post + comments
        const data = await getDonutPost(donutID, postOrder);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching post ${donutID}, ${postOrder} with comments`
        })
    }
});

router.get('/donut/:donutID/profile/:profile', auth, async (req, res) => {
    try {
        const { donutID, profile } = req.params;

        const data = await getProfileDonutPost(donutID, profile);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching post ${donutID}, ${profile} with comments`
        })
    }
});

router.post('/:donutID', auth, multerMid.array("files"), async (req, res) => {
    try {
        const { donutID } = req.params;
        /**
         * type post = {
         *    title: string;
         *    description: string;
         *    author: string;
         * }
         */
        const { title, author, description } = req.body;

        // Create a post
        const newPost = await createPost(donutID, { title, author, description }, req.files);
        
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

        // Edit post
        const editedPost = await updatePost(donutID, postOrder, post)
        
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
        const data = createPostReaction(donutID, postOrder, reaction);

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

        // Deletes post
        await deletePost(donutID, postOrder);

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