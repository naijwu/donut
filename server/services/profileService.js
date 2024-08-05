import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email of the user whom hobbies will be used as a divisor
 */
export async function findPartner(email) {
    if(!email) return false;
    
    return await withOracleDB(async (connection) => {
        try {
            const { rows } = await connection.execute(
                `SELECT P.email
                FROM Profile P
                WHERE NOT EXISTS (
                    SELECT PH.hobby
                    FROM ProfileHobby PH
                    WHERE PH.profile = :email
                    EXCEPT
                    SELECT PH2.hobby
                    FROM ProfileHobby PH2
                    WHERE PH2.profile = P.email
                )
                AND NOT EXISTS (
                    SELECT PH2.hobby
                    FROM ProfileHobby PH2
                    WHERE PH2.profile = P.email
                    EXCEPT
                    SELECT PH.hobby
                    FROM ProfileHobby PH
                    WHERE PH.profile = :email
                )
                AND P.email <> :email
                LIMIT 1`, 
                { email }
            );
            return rows;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
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

export async function donutCount(email, month) {
    return await withOracleDB(async (connection) => {
        console.log('finding number of donuts');
        try {
            const result = await connection.execute(`
                SELECT TO_CHAR(Donut.createdAt, 'YYYY-MM') AS donut_created_month, COUNT(*) AS donut_count
                FROM Profile
                INNER JOIN AssignedTo ON Profile.email = AssignedTo.profile
                INNER JOIN Donut ON AssignedTo.donutID = Donut.donutID
                WHERE Profile.email = :email AND TO_CHAR(Donut.createdAt, 'YYYY-MM') = :month
                GROUP BY TO_CHAR(Donut.createdAt, 'YYYY-MM')
            `, 
            { email, month });
            return result.rows;
        } catch (err) {
            console.log('err: ', err);
            throw err;
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * Filters hobbies of user
 * @param {*} startsWith the first few (or all) letters of the hobby
 * @param {*} hobbyCategory user selected category attribute for hobby
 */
export async function findHobby(startsWith, hobbyCategory) {
    return await withOracleDB(async (connection) => {
        console.log('finding filtered hobbies')
        try {
            const result = await connection.execute(
                `SELECT * FROM hobbies
                    WHERE hobby LIKE 'startsWith%'
                    AND category = :hobbyCategory`, 
                { startsWith, hobbyCategory }
            );
            return result
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


export async function createAddress(city, province, postalCode) {
    // if(!city || !province || !postalCode) return false;
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO PostalLocation (postalCode, city, province) VALUES (:postalCode, :city, :province)`, 
                { postalCode, city, province }
            );
            
            return true;
        } catch(err) {
            console.log('err: ', err);
            throw err;
        }
    }).catch((err) => {
        return err;
    });
}