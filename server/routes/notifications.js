
import express from 'express'
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;

        // return all Notification of a user
        const data = {}

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching all notifications sent to ${email}`
        })
    }
});

router.delete('/:notificationID', auth, async (req, res) => {
    try {
        const { notificationID } = req.params;

        // TODO: Delete notification
        const query = {}
        
        res.status(200).json({
            message: `Deleted notification ${notificationID}`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error deleting notification ${notificationID}`
        })
    }
});

export default router;