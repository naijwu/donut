import { withOracleDB } from "../dbConfig.js";

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
            const result = await connection.execute(query, [tableName]);
            return result.rows.map(row => row[0]);
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

export async function projectColumns(tableName, columns) {
    return await withOracleDB(async (connection) => {
        try {
            const columnsStr = columns.join(', ');
            const query = `SELECT ${columnsStr} FROM ${tableName}`;
            const result = await connection.execute(query);
            return result.rows;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}