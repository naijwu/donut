
import express from 'express'
import {
    createTable,
    dropAllTables,
    insertDemo,
    insertHobbies,
    makeRandomPairings
} from '../services/queryService.js'

const router = express.Router();

router.post('/dropAll', async (req, res) => {
    try {
        const result = await dropAllTables();

        res.status(200).json({
            message: `res: ${JSON.stringify(result)}`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post('/create', async (req, res) => {
    try {
        const result = await createTable();

        res.status(200).json({
            message: `res: ${JSON.stringify(result)}`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post('/inserthobbies', async(req, res) => {
    try {
        const result = await insertHobbies();

        res.status(200).json({
            message: `inserted`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post('/insertdemo', async(req, res) => {
    try {
        const result = await insertDemo();

        res.status(200).json({
            message: `inserted`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
})


router.post('/pair', async(req, res) => {
    try {
        await makeRandomPairings();
        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
})

export default router;