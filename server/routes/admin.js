import express from 'express';
import { auth } from '../middleware/auth.js'
import { 
    getTableNames, 
    getColumnNames,
    projectColumns 
} from '../services/adminService.js';

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

// router.get('/columns', auth, async (req, res) => {
//     const { table } = req.query;
//     try {
//         const columns = await getColumnNames(table);
//         res.json({ columnNames: columns });
//     } catch (error) {
//         console.log(err);
//         res.status(500).json({
//             message: `Error finding partner`
//         })
//     }
// });

// router.post('/projection', auth, async (req, res) => {
//     const { table, columns } = req.body;
//     try {
//         const result = await projectColumns(table, columns);
//         res.json({ projection: result });
//     } catch (error) {
//         console.log(err);
//         res.status(500).json({
//             message: `Error finding partner`
//         })
//     }
// });

export default router;
