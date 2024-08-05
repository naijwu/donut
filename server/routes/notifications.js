
import express from 'express'
import { auth } from '../middleware/auth.js';
import { getUserNotifications, insertNotification, deleteNotification } from '../services/notificationsService.js';

const router = express.Router();

router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // return all Notification of a user
        const data = await getUserNotifications(email);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching all notifications sent to ${email}`
        })
    }
});

router.post('/:email/:message', async (req, res) => {
    console.log("inserting a notif")
    const { email, message } = req.params;

    try {
        // return all Notification of a user
        const data = await insertNotification(email, message);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error inserting notification for ${email}`
        })
    }
})

router.delete('/:notificationID', async (req, res) => {
    const { notificationID } = req.params;

    try {
        // Deletes notificatioin
        await deleteNotification(notificationID);
        
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