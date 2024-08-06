import { withOracleDB } from "../dbConfig.js";
import { deleteFilesInFolder, uploadFile } from "../utils/storage.js";
import { sqlifyDate } from "../utils/helpers.js";

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

const deleteFiles = async (path, names) => {
    if (!path || !names) return;

    await deleteFilesInFolder(path, names);
}

export async function getAllPosts() {
    return await withOracleDB(async (connection) => {
        try {
            
            // get donuts data
            const q =
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
                    p1.email <> p2.email
                ORDER BY d.createdAt DESC`

            const { rows } = await connection.execute(q);

            // get posts per donut
            const donutMap = {}
            for (let i= 0; i < rows.length; i++) {
                const row = rows[i]
                donutMap[row[0]] = {
                    donutID: row[0],
                    createdAt: row[1],
                    isCompleted: row[2],
                    course: row[3],
                    suggestedActivity: row[4],
                    groupName: row[5],
                    members: [
                        {
                            email: row[6],
                            fullName: row[7],
                            pictureURL: row[8]
                        },
                        {
                            email: row[9],
                            fullName: row[10],
                            pictureURL: row[11]
                        }
                    ],
                    posts: []
                }
            }

            const donutIDs = Object.keys(donutMap)
            for (let i = 0; i < donutIDs.length; i++) {
                const postQ = `
                    SELECT
                        p.donutID,
                        p.title,
                        p.postOrder,
                        p.description,
                        p.createdAt,
                        p1.email,
                        p1.fullName,
                        p1.pictureURL
                    FROM
                        Post p,
                        Profile p1
                    WHERE
                        p.author=p1.email AND 
                        p.donutID=:donutID`;
                const { rows } = await connection.execute(postQ, {donutID: donutIDs[i]});
                
                const postsData = []
                for (let j = 0; j < rows.length; j++) {
                    const pRow = rows[j]

                    const reactions = {}
                    const reac = await connection.execute(
                        `SELECT * FROM PostReaction WHERE donutID=:donutID AND postOrder=:postOrder`, {
                            donutID: donutIDs[i],
                            postOrder: pRow[2]
                        }
                    );
                    // freq table of all emojis (rows[j][3])
                    for (let j = 0; j < reac.rows.length; j++) {
                        if (reactions[reac.rows[j][3]] && reactions[reac.rows[j][3]] > 0) {
                            reactions[reac.rows[j][3]] += 1;
                        }
                    }
                    const images = []
                    const imgs = await connection.execute(
                        `SELECT * FROM Picture WHERE donutID=:donutID AND postOrder=:postOrder`, {
                            donutID: donutIDs[i],
                            postOrder: pRow[2]
                        }
                    );
                    // add images to an array
                    for (let j = 0; j < imgs.rows.length; j++) {
                        const imgRow = imgs.rows[j]
                        images.push({
                            pictureURL: imgRow[0],
                            alt: imgRow[3]
                        })
                    }

                    postsData.push({
                        donutID: pRow[0],
                        title: pRow[1],
                        postOrder: pRow[2],
                        description: pRow[3],
                        createdAt: pRow[4],
                        author: pRow[5],
                        profile: {
                            email: pRow[5],
                            fullName: pRow[6],
                            pictureURL: pRow[7]
                        },
                        reactions,
                        images
                    })
                }
                donutMap[donutIDs[i]].posts = postsData;
            }

            const retArr = []
            for (let i = 0; i < donutIDs.length; i++) {
                if (donutMap[donutIDs[i]]?.posts.length > 0) {
                    retArr.push(donutMap[donutIDs[i]])
                }
            }

            return retArr;
        } catch (error) {
            console.log(error);
        }
    }).catch((err) => {
        console.error(err)
    })
}
  
/**
 * Returns all posts
 */
export async function getAllPostsOLD() {
    console.log("getting donut posts")

    return await withOracleDB(async (connection) => {
        try {
            // should've parsed from array to objects at the service level earlier :(
            const parsed = {}
            const oldQ = `
            SELECT 
                p.donutID,
                p.title,
                p.postOrder,
                p.createdAt,
                p.author,
                p.description,
                d.donutID,
                d.createdAt,
                d.isCompleted,
                d.course,
                d.suggestedActivity,
                d.groupName,
                p1.email,
                p1.pictureURL,
                p1.fullName,
                p2.email,
                p2.pictureURL,
                p2.fullName,
                p3.email,
                p3.pictureURL,
                p3.fullName
            FROM 
                Post p, 
                Donut d,
                AssignedTo a1,
                AssignedTo a2,
                Profile p1,
                Profile p2,
                Profile p3
            WHERE 
                p.donutID = d.donutID AND
                d.donutID = a1.donutID AND 
                a1.profile=p1.email AND 
                d.donutID = a2.donutID AND
                a2.profile=p2.email AND
                p1.email <> p2.email AND
                p3.email = p.author`;
            const result = await connection.execute(oldQ);
            
            const keysAreIDandOrder = {} // alternatively, `new Set()`...
            const allDonuts = {} // ... and this too 
            for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows[i];
                allDonuts[row[0]] = {
                    donutID: row[6],
                    createdAt: row[7],
                    isCompleted: row[8],
                    course: row[9],
                    suggestedActivity: row[10],
                    groupName: row[11],
                    posts: [],
                    members: [
                        {
                            email:row[12],
                            pictureURL: row[13],
                            fullName:row[14],
                        },
                        {
                            email:row[15],
                            pictureURL: row[16],
                            fullName:row[17],
                        }
                    ]
                }

                const tempIdentifier = `${row[0]}_${row[2]}`;
                keysAreIDandOrder[tempIdentifier] = ''
                parsed[tempIdentifier] = {
                    donutID: row[0],
                    title: row[1],
                    postOrder: row[2],
                    createdAt: row[3],
                    author: row[4],
                    description: row[5],
                    profile: {
                        email: row[18],
                        pictureURL: row[19],
                        fullName: row[20]
                    }
                }
            }
            const queryForReactions = Object.keys(keysAreIDandOrder);
            for (let i = 0; i < queryForReactions.length; i++) {
                const donutID = queryForReactions[i].split('_')[0]
                const postOrder = queryForReactions[i].split('_')[1]

                const reactions = {}
                const reac = await connection.execute(
                    `SELECT * FROM PostReaction WHERE donutID=:donutID AND postOrder=:postOrder`, {
                        donutID,
                        postOrder
                    }
                );

                // freq table of all emojis (rows[j][3])
                for (let j = 0; j < reac.rows.length; j++) {
                    if (reactions[reac.rows[j][3]] && reactions[reac.rows[j][3]] > 0) {
                        reactions[reac.rows[j][3]] += 1;
                    }
                }

                const images = []
                const imgs = await connection.execute(
                    `SELECT * FROM Picture WHERE donutID=:donutID AND postOrder=:postOrder`, {
                        donutID,
                        postOrder
                    }
                );

                // add images to an array
                for (let j = 0; j < imgs.rows.length; j++) {
                    const imgRow = imgs.rows[j]
                    images.push({
                        pictureURL: imgRow[0],
                        alt: imgRow[3]
                    })
                }

                // inject reactions to main return data
                const justToBeSafe = JSON.parse(JSON.stringify(parsed[queryForReactions[i]]))
                parsed[queryForReactions[i]] = {
                    ...justToBeSafe,
                    reactions,
                    images
                }
            }

            // turn object into array
            const parsedArr = [];
            for (let i = 0; i < queryForReactions.length; i++) {
                parsedArr.push(parsed[queryForReactions[i]])
            }

            const donuts = Object.keys(allDonuts);
            for (let i = 0; i < donuts.length; i++) {
                for (let j = 0; j < parsedArr.length; j++) {
                    const cpy = JSON.parse(JSON.stringify(allDonuts[parsedArr[j].donutID].posts));
                    cpy.push(parsedArr[j]);
                    allDonuts[parsedArr[j].donutID].posts = cpy
                }
            }

            const arrayified = []
            for (let i = 0; i < donuts.length; i++) {
                arrayified.push(allDonuts[donuts[i]])
            }

            // result of a leetcode extraeasy question
            return arrayified;
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
                `SELECT * 
                FROM 
                    Post p, 
                    Donut d 
                WHERE 
                    p.donutID=:donutID AND 
                    p.donutID = d.donutID AND 
                    p.author=:profile`, 
                {
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
 * @param {*} donutID the donut to which the post belongs to
 * @param {*} postOrder the specific post of the donut
 * @returns the pictures of a post
 */
export async function getImagesOfPost(donutID, postOrder) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM Picture WHERE donutID=:donutID AND postOrder=:postOrder`, {
                    donutID,
                    postOrder
                }
            )
            return result.rows;
        } catch (err) {
            console.log('err: ', err);
        }
    }).catch((err) => {
        return err;
    })
}

/**
 * 
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 */
export async function getDonutPost(donutID, postOrder) {
    return await withOracleDB(async (connection) => {
        try {
            const { rows } = await connection.execute(
                `SELECT 
                    p.donutID,
                    p.postOrder,
                    p.title,
                    p.createdAt,
                    p.description,
                    u.email,
                    u.pictureURL,
                    u.fullName,
                    d.createdAt,
                    d.isCompleted,
                    d.course,
                    d.suggestedActivity,
                    d.groupName,
                    p1.email,
                    p1.pictureURL,
                    p1.fullName,
                    p2.email,
                    p2.pictureURL,
                    p2.fullName
                FROM 
                    Post p, 
                    Donut d,
                    Profile u,
                    AssignedTo a1,
                    AssignedTo a2,
                    Profile p1,
                    Profile p2
                WHERE 
                    p.donutID=:donutID AND 
                    p.donutID = d.donutID AND 
                    p.postOrder=:postOrder AND
                    p.author=u.email AND
                    d.donutID = a1.donutID AND 
                    a1.profile=p1.email AND 
                    d.donutID = a2.donutID AND
                    a2.profile=p2.email AND
                    p1.email <> p2.email`, 
                {
                    donutID,
                    postOrder
                }
            );
            const row = rows[0]

            const images = []
            const postImgs = await connection.execute(
                `SELECT * FROM Picture WHERE donutID=:donutID AND postOrder=:postOrder`, {
                    donutID,
                    postOrder
                }
            )
            for (let i = 0; i < postImgs.rows.length; i++) {
                const imgRow = postImgs.rows[i];
                images.push({
                    pictureURL: imgRow[0],
                    alt: imgRow[3]
                })
            }

            const reactions = {}
            const reac = await connection.execute(
                `SELECT * FROM PostReaction WHERE donutID=:donutID AND postOrder=:postOrder`, {
                    donutID,
                    postOrder
                }
            );

            // freq table of all emojis (rows[j][3])
            for (let j = 0; j < reac.rows.length; j++) {
                if (reactions[reac.rows[j][3]] && reactions[reac.rows[j][3]].count > 0) {
                    const cpy = JSON.parse(JSON.stringify(reactions[reac.rows[j][3]]))
                    cpy.profiles.push(reac.rows[j][0])
                    cpy.count += 1;
                    reactions[reac.rows[j][3]] = cpy
                } else {
                    reactions[reac.rows[j][3]] = {
                        count: 1,
                        profiles: [reac.rows[j][0]]
                    };
                }
            }
            
            const retData = {
                donutID: row[0],
                postOrder: row[1],
                title: row[2],
                createdAt: row[3],
                description: row[4],
                author: row[5],
                profile: {
                    email: row[5],
                    pictureURL: row[6],
                    fullName: row[7]
                },
                donut: {
                    donutID: row[0],
                    createdAt: row[8],
                    isCompleted: row[9],
                    course: row[10],
                    suggestedActivity: row[11],
                    groupName: row[12],
                    members: [
                        {
                            email: row[13],
                            pictureURL: row[14],
                            fullName: row[15]
                        }, 
                        {
                            email: row[16],
                            pictureURL: row[17],
                            fullName: row[18]
                        }
                    ]
                },
                images,
                reactions
            }

            return retData;
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

            // save the post
            const { title, author, description } = postData;
            const createdAt = sqlifyDate(new Date());

            await connection.execute(
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

            // upload the images and get the URLs of the upload images
            let pictureURLs = await uploadFiles(files, `${donutID}_${postOrder}`);

            // save the images PostImage
            for (let i = 0; i < pictureURLs.length; i++) {
                if (pictureURLs[i]) {
                    try {
                        console.log(pictureURLs[i], donutID, postOrder)
                         await connection.execute(
                            `INSERT INTO Picture VALUES(:picture, :donutID, :postOrder, :alt)`, {
                                picture: `${pictureURLs[i]}`,
                                donutID,
                                postOrder,
                                alt: `Picture ${i}`
                            }, {
                                autoCommit: true
                            })
                    } catch (err) {
                        console.log('Error while saving image URLs', err)
                    }
                }
            }
            
            return 'Successfully created a post';
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
export async function updatePost(donutID, postOrder, postData, files) {
    return await withOracleDB(async (connection) => {
        try {
            
            // save the post
            const { title, description, _imagesToDelete } = postData;

            await connection.execute(
                `UPDATE Post 
                SET 
                title=:title,
                description=:description
                WHERE donutID=:donutID AND postOrder=:postOrder`, {
                    donutID,
                    title,
                    postOrder,
                    description
                }, {
                    autoCommit: true
                }
            );

            // upload the images and get the URLs of the upload images
            let pictureURLs = await uploadFiles(files, `${donutID}_${postOrder}`);

            // save the images PostImage
            for (let i = 0; i < pictureURLs.length; i++) {
                if (pictureURLs[i]) {
                    try {
                        console.log(pictureURLs[i], donutID, postOrder)
                         await connection.execute(
                            `INSERT INTO Picture VALUES(:picture, :donutID, :postOrder, :alt)`, {
                                picture: `${pictureURLs[i]}`,
                                donutID,
                                postOrder,
                                alt: `Picture ${i}`
                            }, {
                                autoCommit: true
                            })
                    } catch (err) {
                        console.log('Error while saving image URLs', err)
                    }
                }
            }

            // delete any images that are staged to delete
            const imgsInStorageToDelete = []
            const bucketName = `${donutID}_${postOrder}`;
            for (let i = 0; i < _imagesToDelete.length; i++) {
                const imgNameSplit = _imagesToDelete[i].split('/'); // 'ubc_donuts_alpha/III_I/I.I'
                const imgName = imgNameSplit[imgNameSplit.length - 1];
                imgsInStorageToDelete.push(imgName);
            }

            if (imgsInStorageToDelete.length > 0) {
                await deleteFiles(bucketName, imgsInStorageToDelete);
            }

            // delete images from the Picture table
            for (let i = 0; i < _imagesToDelete.length; i++) {
                try {
                     await connection.execute(
                        `DELETE FROM Picture WHERE pictureURL=:picture`, {
                            picture: `${_imagesToDelete[i]}`,
                        }, {
                            autoCommit: true
                        })
                } catch (err) {
                    console.log('Error while deleting pictures', err)
                }
            }
            
            return 'Successfully updated a post';
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
 * @param {*} reactionData the data to populate the Reaction entity
 * @returns the reaction that is created
 */
export async function handlePostReaction(donutID, postOrder, reactionData) {
    const { profile, emoji } = reactionData;

    return await withOracleDB(async (connection) => {
        try {

            const { rows } = await connection.execute(
                `SELECT 
                    COUNT(*) 
                FROM 
                    PostReaction 
                WHERE 
                    profile=:profile AND 
                    donutID=:donutID AND 
                    postOrder=:postOrder AND 
                    emoji=:emoji`, 
                {
                    profile,
                    donutID,
                    postOrder,
                    emoji
                });

            if (rows[0] > 0) {
                // delete
                await connection.execute(
                    `DELETE FROM 
                        PostReaction 
                    WHERE 
                        profile=:profile AND 
                        donutID=:donutID AND 
                        postOrder=:postOrder AND 
                        emoji=:emoji`, 
                    {
                        profile,
                        donutID,
                        postOrder,
                        emoji
                    }, {
                        autoCommit: true
                    }
                );
            } else {
                // create
                await connection.execute(
                    `INSERT INTO PostReaction VALUES (:profile, :donutID, :postOrder, :emoji)`, 
                    {
                        profile,
                        donutID,
                        postOrder,
                        emoji
                    }, {
                        autoCommit: true
                    }
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
 * @param {*} donutID to identify the post
 * @param {*} postOrder to identify the post
 */
export async function deletePost(donutID, postOrder) {
    return await withOracleDB(async (connection) => {
        console.log('deleting post for donut ' + donutID)
        try {
            await connection.execute(
                'DELETE FROM Post WHERE donutID=:donutID AND postOrder=:postOrder',
                { donutID, postOrder },
                {
                    autoCommit: true
                }
            )
            return true;
        } catch (err) {
            console.log('err: ', err);
        }
    })
}

export async function emojiStats() {
    return await withOracleDB(async (connection) => {
        console.log('Getting emoji stats...');
        try {
            const result = await connection.execute(
                `SELECT reaction_type, AVG(reaction_count) AS avg_reaction_count
                FROM (
                    SELECT emoji AS reaction_type, threadID, COUNT(*) AS reaction_count
                    FROM ThreadReaction
                    GROUP BY emoji, threadID
                ) reactions
                GROUP BY reaction_type`
            );
            return result.rows;
        } catch (err) {
            console.log('err: ', err);
        }
    });
}