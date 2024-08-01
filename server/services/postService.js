import { withOracleDB } from "../dbConfig.js";
import { sqlifyDate } from "./queryService.js";

const uploadFiles = async (files, path) => {
    if (files.length === 0) return [];
  
    // NOTE: Image names are numbers for no particular reason
    const uploadPromises = files.map(async (file, index) => {
      return await uploadFile(file, path, index);
    });
  
    try {
      const publicUrls = await Promise.all(uploadPromises);
      console.log("All files uploaded:", publicUrls);
      return publicUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
};
  
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
export async function createPost(donutID, postData, files) {
    return await withOracleDB(async (connection) => {
        try {
            // check if there exists a post in this donut already (to determine postOrder)
            let postOrder = 1;
            const existing = await connection.execute(`SELECT COUNT(*) FROM Post WHERE donutID=:donutID`, { donutID })
            if(existing.rows[0][0] > 0) postOrder = 2; // because there exists a post

            // upload the images and get the URLs of the upload images
            let pictureURLs = await uploadFiles(files, `${donutID}_${postOrder}`);

            // save the images PostImage
            for (let i = 0; i < pictureURLs.length; i++) {
                try {
                     await connection.execute(
                        `INSERT INTO Picture VALUES(:pictureURL, :donutID, :postOrder, :alt)`, {
                            pictureURL: `${pictureURLs[i]}`,
                            donutID,
                            postOrder,
                            alt: `Picture ${i}`
                        })
                } catch (err) {
                    console.err('Error while saving image URLs')
                }
            }

            // save the post
            const { title, author, description } = postData;
            const createdAt = sqlifyDate(new Date());

            const result = await connection.execute(
                `INSERT INTO Post VALUES (:donutID, :title, :postOrder, :createdAt, :author, :description)`, {
                    donutID,
                    title: title,
                    postOrder,
                    createdAt,
                    author,
                    description
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