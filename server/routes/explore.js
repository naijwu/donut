import express from 'express';
import { auth } from '../middleware/auth.js'
import { 
    getTableNames, 
    getColumnNames,
    projectColumns,
    profileCount,
    generateInsertStatements
} from '../services/exploreService.js';

const router = express.Router();

router.post('/all', auth, async (req, res) => {
    try {
        const { tables } = req.body;
        const statements = await generateInsertStatements(tables);

        res.status(200).json(statements)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

router.get('/tables', auth, async (req, res) => {
    try {
        const tables = await getTableNames();

        res.status(200).json(tables)
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Error finding partner`
        })
    }
});

router.post('/profileCount/:attribute', auth, async (req, res) => {
    try {
        const { attribute } = req.params;
        const { value } = req.body;
        const data = await profileCount(attribute, value);
        res.status(200).json(data); 
    } catch (err) {
        console.error('Failed to get profile count:', err);
        res.status(500).json({
            message: 'Error counting profiles',
            error: err.message
        });
    }
});

export default router;