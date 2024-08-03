import { v4 as uuidv4 } from 'uuid';

/**
 * 
 * @param {*} email the profile the notifications are for
 */
export async function getUserNotifications(email) {
    console.log("getting user notifications");
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
            const time = sqlifyDatetime(new Date());
            const notificationID = uuidv4();

            await connection.execute(
                `INSERT INTO Notification VALUES (:notificationID, :time, :message, :receiver)`, 
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

}