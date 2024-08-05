
import express from 'express'
import { auth } from '../middleware/auth.js'
import {
    findPartner,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllHobbies,
    createHobbiesOfUser,
    deleteHobbiesOfUser,
    findHobby,
    donutCount
} from '../services/profileService.js'

const router = express.Router();

// Division: Find all users with the exact same hobbies
router.get('/findpartner/:email', auth, async (req, res) => {
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

// Find all hobbies
router.get('/hobbies', auth, async (req, res) => {
    try {
        const data = await getAllHobbies();

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error getting all hobbies`
        })
    }
});

// Selection: Find filtered hobbies
router.get('/:startsWith/:category/findHobby/', auth, async (req, res) => {
    try {
        const { startWith, category } = req.params;

        const data = await findHobby(startWith, category);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error filtering hobbies`
        })
    }
})

router.get('/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;

        console.log('email hit: ', email)

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
        const { profile, hobbies } = req.body;

        await updateProfile(email, profile);
        await deleteHobbiesOfUser(email);
        await createHobbiesOfUser(email, hobbies);
        
        res.status(200).json({
            message: 'Successfully updated profile'
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

// Group By (aggregation): find the number of donuts for profiel
router.get('/:email/donutCount', auth, async (req, res) => {
    try {
        const { email } = req.params;
        const data = await donutCount(email);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error retrieving donut count`
        });
    }
});

export default router;