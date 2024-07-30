
import express from 'express'
import { auth } from '../middleware/auth.js';
import {
    findPartner,
    getProfile,
    updateProfile,
    deleteProfile
} from '../services/profileService.js'

const router = express.Router();

// Division: Find all users with the exact same hobbies
router.get('/:email/findpartner', auth, async (req, res) => {
    try {
        const { email } = req.params;

        const data = await findPartner(email);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

router.get('/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;

        // select Profile
        const data = await getProfile(email);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error fetching profile ${email}`
        })
    }
});

router.patch('/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;
        /**
         * type post = {
         *    email: string;
         *    pictureURL: string;
         *    gender: 'male' | 'female';
         *    age: number;
         *    fullName: string;
         *    enabled: boolean; 
         *    year: number;
         *    major: Majors;
         *    settings: any;
         *    address: string;
         *    postalCode: string;
         * }
         */
        const { profile } = req.body;

        // TODO: Edit data
        const editedProfile = await updateProfile(email, profile);
        
        res.status(200).json({
            data: editedProfile
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error updating profile ${email}`
        })
    }
});

router.delete('/:email', auth, async(req, res) => {
    try {
        const { email } = req.params;

        // Delete profile
        await deleteProfile(email);

        res.status(200).json({
            message: 'Profile deleted'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error deleting profile ${email}`
        })
    }
})


export default router;