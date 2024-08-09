
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
    donutCount,
    createAddress
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

// Find all hobbies
router.post('/hobbies/search', auth, async (req, res) => {
    try {
        const data = await findHobby(req.body.search);

        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error getting all hobbies`
        })
    }
});

// fetch profile
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
         * type profile = {
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
         *    username: string;
         * }
         */
        const { profile, hobbies } = req.body;

        // Update profile
        const updateProfileRes = await updateProfile(email, profile);
        if (!updateProfileRes.success) {
            return res.status(400).json({
                message: `Failed to update profile: ${updateProfileRes.message}`
            });
        }

        // Delete existing hobbies
        const deleteHobbiesOfUserRes = await deleteHobbiesOfUser(email);
        if (!deleteHobbiesOfUserRes.success) {
            return res.status(400).json({
                message: 'Failed to delete existing hobbies'
            });
        }

        // Create new hobbies
        const createHobbiesOfUserRes = await createHobbiesOfUser(email, hobbies);
        if (!createHobbiesOfUserRes.success) {
            return res.status(400).json({
                message: 'Failed to create new hobbies'
            });
        }

        // If all operations succeed, return success message
        return res.status(200).json({
            message: 'Successfully updated profile'
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error updating profile`
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
router.get('/:email/:date/donutCount', auth, async (req, res) => {
    try {
        const { email, date } = req.params;

        const data = await donutCount(email, date);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error retrieving donut count`
        });
    }
});

// http://localhost:4000/profile/Surrey/BC/V4N1Z1/createAddy
router.patch('/:city/:province/:postalCode/createAddy', auth, async (req, res) => {
    try {
        const { city, province, postalCode } = req.params;

        await createAddress(city, province, postalCode);

        res.status(200).json({
            message: 'Successfully created address'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error creating address`
        })
    }
});

export default router;