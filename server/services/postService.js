import { withOracleDB } from "../dbConfig.js";

/**
 * Returns all posts
 */
export async function getAllPosts() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Post p, Donut d WHERE p.donutID = d.donutID`, {
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
 * @param {*} donutID the donut to which the post belongs to
 * @param {*} email the profile to which the post belongs to
 */
export async function getProfileDonutPost(donutID, email) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Post p, Donut d WHERE p.donutID=:donutID AND p.donutID = d.donutID AND p.author=:profile`, {
                    donutID,
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
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 */
export async function getDonutPost(donutID, postOrder) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Post p, Donut d WHERE p.donutID=:donutID AND p.donutID = d.donutID AND postOrder=:postOrder`, {
                    donutID,
                    postOrder
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
 * @param {*} donutID to identify which donut the post will be a subset of
 * @param {*} postData the data that will populate the Post entity
 * @returns the post that is created
 */
export async function createPost(donutID, postData) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Post VALUES (:donutID, :title, :postOrder, :createdAt, :author, :description)`, {
                    donutID,
                    postOrder
                }, {
                    autoCommit: true
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
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 * @param {*} postData the data to update the Post entity with
 * @returns the post that is edited
 */
export async function updatePost(donutID, postOrder, postData) {

}

/**
 * 
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 * @param {*} reactionData the data to populate the Reaction entity
 * @returns the reaction that is created
 */
export async function createPostReaction(donutID, postOrder, reactionData) {

}

/**
 * 
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 */
export async function deletePost(donutID, postOrder) {

}