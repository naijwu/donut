import { withOracleDB } from "../dbConfig.js";
import { sqlifyDate } from "../utils/helpers.js";

export async function getTableNames() {
    return await withOracleDB(async (connection) => {
        console.log('getting table names')
        try {
            const query = `SELECT table_name FROM user_tables`;
            const result = await connection.execute(query);
            return result.rows.map(row => row[0]);
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

export async function getColumnNames(tableName) {
    return await withOracleDB(async (connection) => {
        try {   
            const query = `SELECT column_name FROM user_tab_columns WHERE table_name = :tableName`;
            const result = await connection.execute(query, {tableName});
            return result.rows.map(row => row[0]);
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

export async function projectColumns(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        try {
            const attributesStr = attributes.join(', ');
            const query = `SELECT ${attributesStr} FROM ${tableName}`;
            const { rows } = await connection.execute(query);

            const res = []
            for (let r = 0; r < rows.length; r++) {
                const ob = {}
                for (let i = 0; i < attributes.length; i++) {
                    ob[attributes[i]] = rows[r][i]
                }
                res.push(ob);
            }
            console.log(rows, res)

            return res;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

export async function profileCount(attr, value) {
    return await withOracleDB(async (connection) => {
        try {
            let query = `
                SELECT 
                    count(email)
                FROM 
                    Profile
                WHERE 
                    ${attr}=:value
                GROUP BY 
                    ${attr}`;
            const { rows } = await connection.execute(
                query,
                { value }
            );

            return rows[0]
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }
    }).catch((err) => {
        console.error('DB Error:', err);
        throw err;
    });
}

export async function generateInsertStatements(tables) {
    return await withOracleDB(async (connection) => {
        const ret = {};
        for (let i = 0; i < tables.length; i++) {
            const query = `SELECT column_name FROM user_tab_columns WHERE table_name = :tableName`;
            const result = await connection.execute(query, {tableName: tables[i]});
            const tableCols = result.rows.map(row => row[0]);
            
            const q = `SELECT * FROM ${tables[i]}`;
            const { rows } = await connection.execute(q);

            const insertStatements = []
            for (let j = 0; j < rows.length; j++) {
                const rowData = rows[j];
                let insertStatement = `INSERT INTO ${tables[i]} VALUES (`

                for (let k = 0; k < rowData.length; k++) {
                    insertStatement += !rowData[k] ? `NULL${k < rowData.length - 1 ? `,` : ``}` : 
                        typeof rowData[k] == 'number'
                            ? `${rowData[k]}${k < rowData.length - 1 ? `,` : ``}`
                            : typeof (rowData[k])?.getMonth == 'function' 
                                ? `TO_DATE('${sqlifyDate(rowData[k])}','yyyy-mmm-dd')${k < rowData.length - 1 ? `,` : ``}`
                                : `'${rowData[k]}${k < rowData.length - 1 ? `',` : `'`}`
                }
                insertStatement+=`);`

                insertStatements.push(insertStatement);
            }
            
            ret[tables[i]] = insertStatements;
        }

        return ret;
    }).catch((err) => {
        console.error('DB Error:', err);
        throw err;
    });
}