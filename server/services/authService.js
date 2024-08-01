import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email to check if an associated profile exists 
 * @returns ?
 */
export async function checkUser(email) {
    return await withOracleDB(async (connection) => {
        try {
            console.log('checking user: ',email)
            const result = await connection.execute(`
                SELECT count(*)
                FROM Profile 
                WHERE email=:email`, {email},
                {autoCommit: true});
            return result.rows[0][0];
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * Creates a profile for a user
 * @param {*} user the user data from Google OAuth2
 */
export async function createProfile(user) {
    return await withOracleDB(async (connection) => {
        try {
            const { name, email, picture } = user;
            console.log('creating user: ',email, name, picture)
            await connection.execute(
                `INSERT INTO Profile (email, fullName, pictureURL) VALUES (:email, :name, :picture)`, 
                {email, name, picture},
                {autoCommit: true}
            );
            console.log('done creating user', email);
            return;
        } catch(err) {
            console.log('err: ', err);
            return;
        }
    }).catch((err) => {
        console.log('err withOracleDB')
        return err;
    });
}