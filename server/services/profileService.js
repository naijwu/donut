import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email of the user whom hobbies will be used as a divisor
 */
export async function findPartner(email) {
    if (!email) return false;
    
    return await withOracleDB(async (connection) => {
        try {
            const { rows } = await connection.execute(
                `SELECT 
                    P.email,
                    P.fullName,
                    p.pictureURL
                 FROM Profile P
                 WHERE NOT EXISTS (
                     SELECT PH.hobby
                     FROM ProfileHobby PH
                     WHERE PH.profile = :email
                     MINUS
                     SELECT PH2.hobby
                     FROM ProfileHobby PH2
                     WHERE PH2.profile = P.email
                 )
                 AND NOT EXISTS (
                     SELECT PH2.hobby
                     FROM ProfileHobby PH2
                     WHERE PH2.profile = P.email
                     MINUS
                     SELECT PH.hobby
                     FROM ProfileHobby PH
                     WHERE PH.profile = :email
                 )
                 AND P.email <> :email
                 FETCH FIRST 1 ROWS ONLY`, 
                { email }
            );
            return rows;
        } catch (err) {
            console.log('err: ', err);
            throw err;
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
                SET 
                gender=:gender,
                age=:age,
                fullName=:fullName,
                enabled=:enabled,
                year=:year,
                major=:major,
                settings=:settings,
                address=:address,
                postalCode=:postalCode,
                pictureURL=:pictureURL,
                username=:username
                WHERE email = :email`, 
                { ...profileData, email }
            );
            return { success: true, message: 'Profile updated!' };
        } catch(err) {
            console.log('err: ', err);
            if (err && err.errorNum === 1) {  // ORA-00001 for unique constraint violation
                return { success: false, message: 'Username already exists.' };
            }
            return { success: false, message: 'Error saving profile' };
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
            return { success: true };
        } catch(err) {
            console.log('err: ', err);
            return { success: false, message: 'Error deleting hobbies' };
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
            return { success: true };
        } catch(err) {
            return { success: false, message: 'Error saving hobbies' };
        }
    }).catch((err) => {
        return err;
    });
}

function parseToQuery(search) {
    let query = `SELECT * FROM Hobby WHERE`
    let args = []

    const statements = search.split(/(\|\||&&)/)
    console.log(statements);
    for (let i = 0; i < statements.length; i++) {
        const s  = statements[i].trim();

        const lhsrhs = s.split('=='); // only supports equality, because diversity equity inclusion <3
        if (lhsrhs.length > 1) {
            query += ` ${lhsrhs[0]}=:${(i / 2)}`
            args.push(lhsrhs[1].replace(/['"]/g, ''))
            if (i < (statements.length - 1)) {
                // not last child
                query += ` ${statements[i + 1] == '&&' ? 'AND' : 'OR'} `
            }
        }
    }

    console.log(query, args)

    return {
        query,
        args
    };
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
                GROUP BY TO_CHAR(Donut.createdAt, 'YYYY-MM')`, 
                { email, month }
            );
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
export async function findHobby(search) {
    return await withOracleDB(async (connection) => {
        console.log('finding filtered hobbies')
        try {
            const {query, args} = parseToQuery(search);
            const { rows } = await connection.execute(
                query, 
                args
            );
            return rows
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
