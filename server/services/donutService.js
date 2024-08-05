import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email of the profile that will be in all returned Donuts
 */
export async function getDonutsOfUser(email) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT 
                    d.donutID,
                    d.createdAt,
                    d.isCompleted,
                    d.course,
                    d.suggestedActivity,
                    d.groupName,
                    p1.email AS member1,
                    p1.fullName AS member1name,
                    p1.pictureURL AS member1picture,
                    p2.email AS member2,
                    p2.fullName AS member2name,
                    p2.pictureURL AS member2picture
                FROM 
                    Donut d, 
                    AssignedTo a1, 
                    AssignedTo a2, 
                    Profile p1, 
                    Profile p2 
                WHERE 
                    d.donutID = a1.donutID AND 
                    a1.profile=p1.email AND 
                    d.donutID = a2.donutID AND
                    a2.profile=p2.email AND
                    p1.email <> p2.email AND
                    a1.profile=:profile
                ORDER BY d.createdAt DESC`, {
                    profile: email
                }
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
 * 
 * @param {*} donutID the ID of the donut to return
 */
export async function getDonut(donutID) {
    return await withOracleDB(async (connection) => {
        try {
            // const result = await connection.execute(
            //     `SELECT * FROM Donut WHERE donutID=:donutID`, {
            //         donutID
            //     }
            // );
            const result = await connection.execute(
                `SELECT DISTINCT
                    d.donutID,
                    d.createdAt,
                    d.isCompleted,
                    d.course,
                    d.suggestedActivity,
                    d.groupName,
                    p1.email AS member1,
                    p1.fullName AS member1name,
                    p1.pictureURL AS member1picture,
                    p2.email AS member2,
                    p2.fullName AS member2name,
                    p2.pictureURL AS member2picture
                FROM 
                    Donut d, 
                    AssignedTo a1, 
                    AssignedTo a2, 
                    Profile p1, 
                    Profile p2 
                WHERE 
                    d.donutID = a1.donutID AND 
                    a1.profile=p1.email AND 
                    d.donutID = a2.donutID AND
                    a2.profile=p2.email AND
                    p1.email <> p2.email AND
                    d.donutID=:donutID`, {
                    donutID
                }
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
 * 
 * @param {*} donutID the ID of the donut in which the messages are sent for
 * @returns an array of message of the donut/groupchat
 */
export async function getDonutMessages(donutID) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT DISTINCT
                    d.donutID,
                    d.createdAt,
                    d.isCompleted,
                    d.course,
                    d.suggestedActivity,
                    d.groupName,
                    p1.email AS member1,
                    p1.fullName AS member1name,
                    p1.pictureURL AS member1picture,
                    p2.email AS member2,
                    p2.fullName AS member2name,
                    p2.pictureURL AS member2picture
                FROM 
                    Donut d, 
                    AssignedTo a1, 
                    AssignedTo a2, 
                    Profile p1, 
                    Profile p2 
                WHERE 
                    d.donutID = a1.donutID AND 
                    a1.profile=p1.email AND 
                    d.donutID = a2.donutID AND
                    a2.profile=p2.email AND
                    p1.email <> p2.email AND
                    d.donutID=:donutID`, {
                    donutID
                }
            );


            const { rows } = await connection.execute(
                `SELECT * 
                FROM 
                    Message 
                WHERE 
                    donutID=:donutID 
                ORDER BY sentAt ASC`, {
                    donutID
                }
            );
            
            const msgs = [];
            for (let i = 0; i < rows.length; i++) {
                const msg = rows[i];
                msgs.push({
                    messageID: msg[0],
                    donutID: msg[1],
                    message: msg[2],
                    sentAt: msg[3],
                    sender: msg[4]
                })
            }

            return { donutData: result.rows, msgs};
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}


/**
 * 
 * @param {*} donutID the ID of the donut to send message in 
 * @param {*} messageData the data to populate the message entity
 * @returns the newly added message entity
 */
export async function sendDonutMessage(donutID, messageData) {
    return await withOracleDB(async (connection) => {
        try {
            const { messageID, message, sqlFriendlyDate, sender } = messageData;

            await connection.execute(
                `INSERT INTO Message VALUES (:messageID, :donutID, :message, :sentAt, :sender)`, {
                    messageID,
                    donutID,
                    message,
                    sentAt: sqlFriendlyDate,
                    sender
                }, {
                    autoCommit: true
                }
            );
            return true;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}