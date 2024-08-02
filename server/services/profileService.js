import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email of the user whom hobbies will be used as a divisor
 */
export async function findPartner(email) {

}

/**
 * Gets all hobbies
 */
export async function getAllHobbies() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Hobby`
            );
            return result.rows;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * Finds profile of given email
 * @param {*} email the email of the profile to return
 */
export async function getProfile(email) {
    if(!email) return false;
    
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * 
                FROM Profile 
                WHERE email = :email`, 
                { email }
            );
            const hobbiesResult = await connection.execute(
                `SELECT * 
                FROM ProfileHobby 
                WHERE profile = :email`, 
                { email }
            );
            return {
                profile: result.rows,
                hobbies: hobbiesResult.rows
            };
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
    return await withOracleDB(async (connection) => {
        console.log('updating profile')
        try {
            const result = await connection.execute(
                `UPDATE Profile 
                SET gender=:gender,age=:age,fullName=:fullName,enabled=:enabled,year=:year,major=:major,settings=:settings,address=:address,postalCode=:postalCode,pictureURL=:pictureURL
                WHERE email = :email`, 
                { ...profileData, email }
            );
            return true;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * Delete all hobbies of a profile
 * @param {*} email the email of the profile whos hobbies will be deleted
 */
export async function deleteHobbiesOfUser(email) {
    return await withOracleDB(async (connection) => {
        console.log('deleting hobbies')
        try {
            const result = await connection.execute(
                `DELETE FROM ProfileHobby WHERE profile = :email`, 
                { email }
            );
            return true;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * Creates hobbies of user
 * @param {*} email the email of the profile that'll have the hobbies
 * @param {*} hobbies an array of hobbies that will be added
 */
export async function createHobbiesOfUser(email, hobbies) {
    return await withOracleDB(async (connection) => {
        console.log('creating hobbies')
        try {
            for (let i = 0; i < hobbies.length; i++) {
                await connection.execute(
                    `INSERT INTO ProfileHobby(profile, hobby) VALUES(:email, :hobby)`, 
                    { email, hobby: hobbies[i] }
                );
            }
            return true;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * 
 * @param {*} email the email of the profile to delete
 */
export async function deleteProfile(email) {
    return await withOracleDB(async (connection) => {
        console.log('deleting profile')
        try {
            const result = await connection.execute(
                'DELETE FROM Profile WHERE email = :email',
                { email }
            )
            return true;
        } catch (err) {
            console.log('err: ', err);
        }
    })
}