import { withOracleDB } from "./demoService.js";

/**
 * 
 * @param {*} email the email of the user whom hobbies will be used as a divisor
 */
export async function findPartner(email) {

}

/**
 * Finds profile of given email
 * @param {*} email the email of the profile to return
 */
export async function getProfile(email) {
    if(!email) return false;
    
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`SELECT * FROM Profile WHERE email=${email}`);
            return result;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * 
 * @param {*} email the email of the profile to update
 * @param {*} profileData the data to update profile with
 */
export async function updateProfile(email, profileData) {

}

/**
 * 
 * @param {*} email the email of the profile to delete
 */
export async function deleteProfile(email) {

}