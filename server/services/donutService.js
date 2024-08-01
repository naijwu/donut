import { withOracleDB } from "../dbConfig.js";

/**
 * 
 * @param {*} email the email of the profile that will be in all returned Donuts
 */
export async function getDonutsOfUser(email) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Donut d, AssignedTo a WHERE d.donutID = a.donutID AND a.profile=:profile`, {
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
    
}

/**
 * 
 * @param {*} donutID the ID of the donut in which the messages are sent for
 * @returns an array of message of the donut/groupchat
 */
export async function getDonutMessages(donutID) {

}

/**
 * 
 * @param {*} donutID the ID of the donut to send message in 
 * @param {*} messageData the data to populate the message entity
 * @returns the newly added message entity
 */
export async function sendDonutMessage(donutID, messageData) {

}