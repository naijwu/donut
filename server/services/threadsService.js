import { withOracleDB } from "../dbConfig.js";
import { v4 as uuidv4 } from 'uuid'
import { sqlifyDate } from "./queryService.js";

export async function getThreads(donutID, postOrder) {
    return await withOracleDB(async (connection) => {
        try {
            const threads = []
            const threadsRes = await connection.execute(
                `SELECT 
                    t.threadID,
                    t.author,
                    t.donutID,
                    t.postOrder,
                    t.parent,
                    t.text,
                    t.createdAt,
                    p.email,
                    p.pictureURL,
                    p.fullName
                FROM 
                    Thread t,
                    Profile p
                WHERE 
                    t.donutID=:donutID AND 
                    t.postOrder=:postOrder AND
                    t.author=p.email`, 
                {
                    donutID,
                    postOrder
                }
            )
            for (let i = 0; i < threadsRes.rows.length; i++) {
                const trow = threadsRes.rows[i];

                const treactions = {}
                const treac = await connection.execute(
                    `SELECT * FROM ThreadReaction WHERE threadID=:threadID`, {
                        threadID: `${trow[0]}`
                    }
                );

                // freq table of all emojis (rows[j][3])
                for (let j = 0; j < treac.rows.length; j++) {
                    if (treactions[treac.rows[j][3]] && treactions[treac.rows[j][3]] > 0) {
                        treactions[treac.rows[j][3]] += 1;
                    }
                }

                threads.push({
                    threadID: trow[0],
                    author: trow[1],
                    parent: trow[4],
                    text: trow[5],
                    createdAt: trow[6],
                    profile: {
                        email: trow[7],
                        pictureURL: trow[8],
                        fullName: trow[9]
                    },
                    reactions: treactions
                })
            }
            return threads;
        } catch(err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    });
}

/**
 * 
 * @param {*} donutID to identify the post that the thread will be created in
 * @param {*} postOrder to identify the post that the thread will be created in
 * @param {*} threadData the data to populate the Thread entity with
 * @returns the thread that is created
 */
export async function createThread(donutID, postOrder, threadData) {
    const { text, author, parent } = threadData;

    return await withOracleDB(async (connection) => {
        try {
            const createdAt = sqlifyDate(new Date());
            const threadID = uuidv4();

            await connection.execute(
                `INSERT INTO Thread VALUES (:threadID, :author, :donutID, :postOrder, :parent, :text, :createdAt)`, 
                {
                    threadID,
                    author,
                    donutID,
                    postOrder,
                    parent,
                    createdAt,
                    text
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
 * @param {*} threadID the thread to update
 * @param {*} threadData the data to update the thread with
 */
export async function updateThread(threadID, threadData) {

}

/**
 * 
 * @param {*} threadID the thread that is being reacted on
 * @param {*} reactionData the data of the ThreadReaction entity
 */
export async function createThreadReaction(threadID, reactionData) {
    
}