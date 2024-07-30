import { withOracleDB } from "./demoService.js";

/**
 * Creates a profile for a user
 * @param {*} user the user data from Google OAuth2
 */
export async function createProfile(user) {
    const { name, email, picture } = user;
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`
                INSERT INTO Profile(email, fullName, pictureURL)
                    VALUES ('${email}', '${name}', '${picture}')
            `);
            return result;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}