import { withOracleDB } from "../dbConfig.js";
import { v4 as uuidv4 } from 'uuid';
import { sqlifyDate } from "../utils/helpers.js";

/**
 * 
 * @param {*} email the profile the notifications are for
 */
export async function getUserNotifications(email) {
    console.log("getting user notifications");

    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Notification WHERE receiver = :email`, 
                { email: email }
            );
            console.log(result);
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
 * @param email - the receiver
 * @param message - the message
 * @param from - the sender
 */

export async function insertNotification(receiver, message) {
    // do we want a sender field? e.g. Jae Wu Liked your post

    return await withOracleDB(async (connection) => {
        try {
            const time = sqlifyDate(new Date());
            const notificationID = uuidv4();

            console.log(notificationID);
            await connection.execute(
                `INSERT INTO Notification (notificationID, time, message, receiver) VALUES (:notificationID, :time, :message, :receiver)`, 
                {
                    notificationID,
                    time,
                    message,
                    receiver,
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

/**
 * 
 * @param {*} notificationID of the notification being deleted
 */
export async function deleteNotification(notificationID) {
    return await withOracleDB(async (connection) => {
        console.log("Deleting notification");
        try {
            await connection.execute(
                `DELETE FROM Notification WHERE notificationID = :notificationID`, 
                {
                    notificationID,
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