import express from 'express';
import { auth } from '../middleware/auth.js'
import { 
    getTableNames, 
    getColumnNames,
    projectColumns 
} from '../services/exploreService.js';

const router = express.Router();

router.get('/tables', auth, async (req, res) => {
    try {
        const tables = await getTableNames();

        res.status(200).json(tables)
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

router.get('/:table/columns', auth, async (req, res) => {
    const { table } = req.params;
    try {
        const columns = await getColumnNames(table);
        res.json(columns);
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

router.post('/:table/projection', auth, async (req, res) => {
    const { table } = req.params;
    const { attributes } = req.body;
    try {
        const result = await projectColumns(table, attributes);
        res.json(result);
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

export default router;
