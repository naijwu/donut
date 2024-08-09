import { withOracleDB } from "../dbConfig.js";
import { v4 as uuidv4 } from 'uuid';
import { sqlifyDate } from "../utils/helpers.js";

const DROP_QUERIES = [
    `DROP TABLE ThreadReaction`,
    `DROP TABLE Thread`,
    `DROP TABLE PostReaction`,
    `DROP TABLE Notification`,
    `DROP TABLE ProfileHobby`,
    `DROP TABLE Hobby`,
    `DROP TABLE Message`,
    `DROP TABLE Picture`,
    `DROP TABLE Post`,
    `DROP TABLE AssignedTo`,
    `DROP TABLE Donut`,
    `DROP TABLE Blacklist`,
    `DROP TABLE BeenPaired`,
    `DROP TABLE Profile`,
    `DROP TABLE PostalLocation`,
]

const INSERT_HOBBIES = [
    `INSERT INTO Hobby VALUES ('Hiking', 'Exploring nature by walking.', 'Sports')`,
    `INSERT INTO Hobby VALUES ('Anime', 'Discussing Japanese animation and manga.', 'Anime')`,
    `INSERT INTO Hobby VALUES ('Driving', 'Racing or commuting by vehicle.', 'Other')`,
    `INSERT INTO Hobby VALUES ('Investing', 'Buying equities.', 'Other')`,
    `INSERT INTO Hobby VALUES ('Running', 'Walking fast for fitness and enjoyment.', 'Sports')`,
    `INSERT INTO Hobby VALUES ('Singing', 'Enjoying vocal music.', 'Music')`,
    `INSERT INTO Hobby VALUES ('Building', 'Creating various projects.', 'Other')`,
    `INSERT INTO Hobby VALUES ('Weightlifting', 'Lifting weights.', 'Sports')`,
    `INSERT INTO Hobby VALUES ('Drawing', 'Drawing some pictures.', 'Art')`,
    `INSERT INTO Hobby VALUES ('Painting', 'Painting some paintings.', 'Art')`,
    `INSERT INTO Hobby VALUES ('League Of Legends', 'I hate my life.', 'Gaming')`,
    `INSERT INTO Hobby VALUES ('CSGO', 'Pew pew.', 'Gaming')`,
    `INSERT INTO Hobby VALUES ('Harry Potter', 'Expelliarmus!', 'Media')`,
]

const INSERT_ALL = [
    `INSERT INTO HOBBY VALUES ('Hiking','Exploring nature by walking.','Sports')`,
    `INSERT INTO HOBBY VALUES ('Anime','Discussing Japanese animation and manga.','Anime')`,
    `INSERT INTO HOBBY VALUES ('Driving','Racing or commuting by vehicle.','Other')`,
    `INSERT INTO HOBBY VALUES ('Investing','Buying equities.','Other')`,
    `INSERT INTO HOBBY VALUES ('Running','Walking fast for fitness and enjoyment.','Sports')`,
    `INSERT INTO HOBBY VALUES ('Singing','Enjoying vocal music.','Music')`,
    `INSERT INTO HOBBY VALUES ('Building','Creating various projects.','Other')`,
    `INSERT INTO HOBBY VALUES ('Weightlifting','Lifting weights.','Sports')`,
    `INSERT INTO HOBBY VALUES ('Drawing','Drawing some pictures.','Art')`,
    `INSERT INTO HOBBY VALUES ('Painting','Painting some paintings.','Art')`,
    `INSERT INTO HOBBY VALUES ('League Of Legends','I hate my life.','Gaming')`,
    `INSERT INTO HOBBY VALUES ('CSGO','Pew pew.','Gaming')`,
    `INSERT INTO HOBBY VALUES ('Harry Potter','Expelliarmus!','Media')`,
    `INSERT INTO PostalLocation VALUES ('V6T1Z4', 'Vancouver', 'British Columbia')`,
    `INSERT INTO PostalLocation VALUES ('V1M3B5', 'Surrey', 'British Columbia')`,
    `INSERT INTO PostalLocation VALUES ('V5A1S6', 'Burnaby', 'British Columbia')`,
    `INSERT INTO PROFILE VALUES ('davidd.lim0528@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocKIRg5rNGpWmv-MVseAkVU8UQaufqvBM5LP7Nd_OG-dtHZAFOE=s96-c',NULL,NULL,'David Lim','1',NULL,NULL,NULL,NULL,NULL,NULL)`,
    `INSERT INTO PROFILE VALUES ('daviddlim11@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocKsn6cm0P8AdpzhphD5C5Vq0xORGghGkSO6z5_4eDtVql7h6vc=s96-c','male',21,'David Dongguhn Lim','1',4,'math',NULL,NULL,NULL,'dave')`,
    `INSERT INTO PROFILE VALUES ('jaewuchun@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c','male',21,'Jae Wu Chun','1',3,'CMS',NULL,NULL,NULL,'jaewuchun')`,
    `INSERT INTO PROFILE VALUES ('upnaijwu@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocJSvATw0FirEprPtEF0jh3i40XFTQuELR8BfAcEkI1ZOXPI4lA=s96-c','male',21,'Lebron James','1',3,'genderstudies',NULL,NULL,NULL,'lebron')`,
    `INSERT INTO DONUT VALUES ('7107b36d-235b-475c-93a0-32f3be6bb375',TO_DATE('05-AUG-2024'),'0',NULL,NULL,NULL)`,
    `INSERT INTO DONUT VALUES ('cdf1e019-2675-4f29-b77b-2f59e6f08574',TO_DATE('06-AUG-2024'),'0',NULL,NULL,NULL)`,
    `INSERT INTO DONUT VALUES ('ed201242-3781-4fda-805b-af3914cbbaf9',TO_DATE('06-AUG-2024'),'0',NULL,NULL,NULL)`,
    `INSERT INTO DONUT VALUES ('e10f602d-2b15-4cf9-8d1d-183eb9b4cada',TO_DATE('06-AUG-2024'),'0',NULL,NULL,NULL)`,
    `INSERT INTO POST VALUES ('ed201242-3781-4fda-805b-af3914cbbaf9','Gone bowling',1,TO_DATE('06-AUG-2024'),'jaewuchun@gmail.com','We went bowling! I had such a blast I scored 10 points')`,
    `INSERT INTO POST VALUES ('cdf1e019-2675-4f29-b77b-2f59e6f08574','We hit the gym',1,TO_DATE('06-AUG-2024'),'upnaijwu@gmail.com','David did not hit 3 plates I hit 2 plates')`,
    `INSERT INTO POST VALUES ('ed201242-3781-4fda-805b-af3914cbbaf9','omg went on a donut with jwuuuu!!!',2,TO_DATE('06-AUG-2024'),'daviddlim11@gmail.com','we went out and did stuff!')`,
    `INSERT INTO PICTURE VALUES ('https://storage.googleapis.com/ubc_donuts_alpha/ed201242-3781-4fda-805b-af3914cbbaf9_1/6335fd4c-aea8-48be-8b2d-2071f58a0069.png','ed201242-3781-4fda-805b-af3914cbbaf9',1,'Picture 0')`,
    `INSERT INTO Blacklist VALUES ('davidd.lim0528@gmail.com','daviddlim11@gmail.com')`,
    `INSERT INTO Blacklist VALUES ('daviddlim11@gmail.com','davidd.lim0528@gmail.com')`,
    `INSERT INTO Notification VALUES ('e5935abb-1cd5-4b4c-a6a6-eddc7400a829', TO_DATE('06-AUG-2024'), 'Added to donut', 'daviddlim11@gmail.com')`,
    `INSERT INTO Notification VALUES ('b9b89f14-d4fc-4de5-9c27-c66559dca3e8', TO_DATE('06-AUG-2024'), 'Added to donut', 'davidd.lim0528@gmail.com')`,
    `INSERT INTO Notification VALUES ('8862445f-bf8b-4d97-9061-7cb9d6895536', TO_DATE('06-AUG-2024'), 'Added to donut', 'upnaijwu@gmail.com')`,
    `INSERT INTO BEENPAIRED VALUES ('davidd.lim0528@gmail.com','upnaijwu@gmail.com',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO BEENPAIRED VALUES ('daviddlim11@gmail.com','jaewuchun@gmail.com',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO ASSIGNEDTO VALUES ('7107b36d-235b-475c-93a0-32f3be6bb375','upnaijwu@gmail.com')`,
    `INSERT INTO ASSIGNEDTO VALUES ('7107b36d-235b-475c-93a0-32f3be6bb375','jaewuchun@gmail.com')`,
    `INSERT INTO ASSIGNEDTO VALUES ('cdf1e019-2675-4f29-b77b-2f59e6f08574','davidd.lim0528@gmail.com')`,
    `INSERT INTO ASSIGNEDTO VALUES ('cdf1e019-2675-4f29-b77b-2f59e6f08574','upnaijwu@gmail.com')`,
    `INSERT INTO ASSIGNEDTO VALUES ('ed201242-3781-4fda-805b-af3914cbbaf9','daviddlim11@gmail.com')`,
    `INSERT INTO ASSIGNEDTO VALUES ('ed201242-3781-4fda-805b-af3914cbbaf9','jaewuchun@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('383d2736-7cec-4280-8ca2-5ae722114256','ed201242-3781-4fda-805b-af3914cbbaf9','thanks man',TO_DATE('06-AUG-2024'),'daviddlim11@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('6e19c429-21df-49c7-94f0-9eba391830f2','ed201242-3781-4fda-805b-af3914cbbaf9','donut time!',TO_DATE('06-AUG-2024'),'daviddlim11@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('f963314a-cc9f-4598-82a3-73c1eeb6816b','ed201242-3781-4fda-805b-af3914cbbaf9','hey dude',TO_DATE('06-AUG-2024'),'daviddlim11@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('ca30344c-6cb5-4db7-ab14-b672cf8287c8','ed201242-3781-4fda-805b-af3914cbbaf9','you wanna hang',TO_DATE('06-AUG-2024'),'daviddlim11@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('999e817a-996a-40a8-aa7a-4b4d22d3eae6','cdf1e019-2675-4f29-b77b-2f59e6f08574','hey lebron',TO_DATE('06-AUG-2024'),'davidd.lim0528@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('c9c23329-b7a6-459b-9df6-7307fc14d2e0','cdf1e019-2675-4f29-b77b-2f59e6f08574','lets go to the jim!!',TO_DATE('06-AUG-2024'),'davidd.lim0528@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('531a1e6f-8a6a-4f8e-8845-5a51dc1e1f19','cdf1e019-2675-4f29-b77b-2f59e6f08574','Sup gang',TO_DATE('06-AUG-2024'),'upnaijwu@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('abcca086-eb22-4368-9033-77039ce040ca','cdf1e019-2675-4f29-b77b-2f59e6f08574','okay you illiterate human',TO_DATE('06-AUG-2024'),'upnaijwu@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('4f34781b-e125-433d-838e-36dc21de1f25','ed201242-3781-4fda-805b-af3914cbbaf9','hey man',TO_DATE('06-AUG-2024'),'jaewuchun@gmail.com')`,
    `INSERT INTO MESSAGE VALUES ('247838ea-ba31-4eda-8b5b-8d77a011771b','ed201242-3781-4fda-805b-af3914cbbaf9','not really but for the sake of demo sure',TO_DATE('06-AUG-2024'),'jaewuchun@gmail.com')`,
    `INSERT INTO PROFILEHOBBY VALUES ('jaewuchun@gmail.com','Building')`,
    `INSERT INTO PROFILEHOBBY VALUES ('jaewuchun@gmail.com','Driving')`,
    `INSERT INTO PROFILEHOBBY VALUES ('jaewuchun@gmail.com','Hiking')`,
    `INSERT INTO PROFILEHOBBY VALUES ('jaewuchun@gmail.com','Investing')`,
    `INSERT INTO PROFILEHOBBY VALUES ('jaewuchun@gmail.com','Weightlifting')`,
    `INSERT INTO PROFILEHOBBY VALUES ('upnaijwu@gmail.com','Building')`,
    `INSERT INTO PROFILEHOBBY VALUES ('upnaijwu@gmail.com','Driving')`,
    `INSERT INTO PROFILEHOBBY VALUES ('upnaijwu@gmail.com','Hiking')`,
    `INSERT INTO PROFILEHOBBY VALUES ('upnaijwu@gmail.com','Investing')`,
    `INSERT INTO PROFILEHOBBY VALUES ('upnaijwu@gmail.com','Weightlifting')`,
    `INSERT INTO POSTREACTION VALUES ('jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'✅')`,
    `INSERT INTO POSTREACTION VALUES ('jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'✨')`,
    `INSERT INTO POSTREACTION VALUES ('jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'❤️')`,
    `INSERT INTO POSTREACTION VALUES ('jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'🔥')`,
    `INSERT INTO THREAD VALUES ('41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','daviddlim11@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,NULL,'it was so fun; lets do it again!',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('771c15e4-f135-4cab-9538-6b4add57aa3c','davidd.lim0528@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','WOW that sounds like so much fun!!! isnt it cool that we have the same name?? i think so :)',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('5d8a4fd2-589d-4b6e-bb3d-97fdf3f43af2','jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','wwwww',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('c1ed68e8-b891-48d8-bc29-a197cd922b9c','jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'771c15e4-f135-4cab-9538-6b4add57aa3c','youre confusing me',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('40c4893a-27da-4198-a523-5ab7c1b4d21c','jaewuchun@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','I dont really want to do that',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('079467c2-9225-4717-9d1b-f84f7b7324c7','upnaijwu@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','are you sure',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREAD VALUES ('3e6e0fc3-695f-439d-b861-09ac5fe020de','davidd.lim0528@gmail.com','ed201242-3781-4fda-805b-af3914cbbaf9',1,'079467c2-9225-4717-9d1b-f84f7b7324c7','comment hehe',TO_DATE('06-AUG-2024'))`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','40c4893a-27da-4198-a523-5ab7c1b4d21c','😭')`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','🔥')`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','5d8a4fd2-589d-4b6e-bb3d-97fdf3f43af2','❤️')`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','771c15e4-f135-4cab-9538-6b4add57aa3c','❤️')`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','771c15e4-f135-4cab-9538-6b4add57aa3c','🔥')`,
    `INSERT INTO THREADREACTION VALUES ('davidd.lim0528@gmail.com','c1ed68e8-b891-48d8-bc29-a197cd922b9c','❤️')`,
    `INSERT INTO THREADREACTION VALUES ('daviddlim11@gmail.com','41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','🔥')`,
    `INSERT INTO THREADREACTION VALUES ('upnaijwu@gmail.com','41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','🔥')`,
    `INSERT INTO THREADREACTION VALUES ('upnaijwu@gmail.com','41d3eeb0-5660-4301-bcc2-83bd15f8e4c1','😭')`
]

const CREATE_QUERIES = [
    `CREATE TABLE PostalLocation(
        postalCode CHAR(6),
        city VARCHAR2(255 CHAR),
        province VARCHAR2(255 CHAR),
        PRIMARY KEY (postalCode))`,
    `CREATE TABLE Profile(
        email VARCHAR2(255 CHAR),
        pictureURL VARCHAR2(1000 CHAR),
        gender CHAR(6),
        age INT,
        fullName VARCHAR2(255 CHAR) NOT NULL,
        enabled CHAR(1) DEFAULT '1',
        year INT,
        major VARCHAR2(255 CHAR),
        settings VARCHAR2(255 CHAR),
        address VARCHAR2(255 CHAR),
        postalCode CHAR(6),
        username VARCHAR2(20 CHAR) UNIQUE,
        PRIMARY KEY (email),
        FOREIGN KEY (postalCode) REFERENCES PostalLocation(postalCode) ON DELETE SET NULL)`,
    `CREATE TABLE BeenPaired(
        profileA VARCHAR2(255 CHAR),
        profileB VARCHAR2(255 CHAR),
        pairedDate DATE NOT NULL,
        PRIMARY KEY (profileA, profileB),
        FOREIGN KEY (profileA) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (profileB) REFERENCES Profile(email) ON DELETE CASCADE)`,
    `CREATE TABLE Blacklist(
        blacklister VARCHAR2(255 CHAR),
        blacklisted VARCHAR2(255 CHAR),
        PRIMARY KEY (blacklister, blacklisted),
        FOREIGN KEY (blacklister) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (blacklisted) REFERENCES Profile(email) ON DELETE CASCADE)`,
    `CREATE TABLE Donut(
        donutID CHAR(36),
        createdAt DATE NOT NULL,
        isCompleted CHAR(1) DEFAULT '0' NOT NULL,
        course VARCHAR2(8 CHAR),
        suggestedActivity VARCHAR2(2000 CHAR),
        groupName VARCHAR2(200 CHAR),
        PRIMARY KEY (donutID))`,
    `CREATE TABLE AssignedTo(
        donutID CHAR(36),
        profile VARCHAR2(255 CHAR),
        PRIMARY KEY (donutID, profile),
        FOREIGN KEY (donutID) REFERENCES Donut(donutID) ON DELETE CASCADE,
        FOREIGN KEY (profile) REFERENCES Profile(email) ON DELETE CASCADE)`,
    `CREATE TABLE Post(
        donutID CHAR(36),
        title VARCHAR2(255 CHAR),
        postOrder INT,
        createdAt DATE NOT NULL,
        author VARCHAR2(255 CHAR) NOT NULL,
        description VARCHAR2(1000 CHAR) NOT NULL,
        PRIMARY KEY (donutID, postOrder),
        FOREIGN KEY (author) REFERENCES Profile(email),
        FOREIGN KEY (donutID) REFERENCES Donut(donutID) ON DELETE CASCADE)`,
    `CREATE TABLE Picture(
        pictureURL VARCHAR2(1000 CHAR),
        donutID CHAR(36),
        postOrder INT,
        alt VARCHAR2(255 CHAR),
        PRIMARY KEY (pictureURL),
        FOREIGN KEY (donutID, postOrder) REFERENCES Post(donutID, postOrder) ON DELETE SET NULL)`,
    `CREATE TABLE Message(
        messageID CHAR(36),
        donutID CHAR(36),
        message VARCHAR2(1000 CHAR) NOT NULL,
        sentAt TIMESTAMP WITH TIME ZONE NOT NULL,
        sender VARCHAR2(255 CHAR) NOT NULL,
        PRIMARY KEY (messageID),
        FOREIGN KEY (donutID) REFERENCES Donut(donutID) ON DELETE CASCADE,
        FOREIGN KEY (sender) REFERENCES Profile(email) ON DELETE CASCADE)`,
    `CREATE TABLE Hobby(
        name VARCHAR2(255 CHAR),
        description VARCHAR2(255 CHAR) NOT NULL,
        category VARCHAR2(255 CHAR) NOT NULL,
        PRIMARY KEY (name))`,
    `CREATE TABLE ProfileHobby(
        profile VARCHAR2(255 CHAR),
        hobby VARCHAR2(255 CHAR),
        PRIMARY KEY (profile, hobby),
        FOREIGN KEY (profile) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (hobby) REFERENCES Hobby(name) ON DELETE CASCADE)`,
    `CREATE TABLE Notification(
        notificationID CHAR(36),
        time DATE NOT NULL,
        message VARCHAR2(255 CHAR) NOT NULL,
        receiver VARCHAR2(255 CHAR) NOT NULL,
        FOREIGN KEY (receiver) REFERENCES Profile(email) ON DELETE CASCADE,
        PRIMARY KEY (notificationID))`,
    `CREATE TABLE PostReaction(
        profile VARCHAR2(255 CHAR),
        donutID CHAR(36),
        postOrder INT,
        emoji VARCHAR2(16 CHAR) NOT NULL,
        PRIMARY KEY (profile, donutID, postOrder, emoji),
        FOREIGN KEY (profile) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (donutID, postOrder) REFERENCES Post(donutID, postOrder) ON DELETE CASCADE)`,
    `CREATE TABLE Thread(
        threadID CHAR(36),
        author VARCHAR2(255 CHAR), 
        donutID CHAR(36),
        postOrder INT,
        parent CHAR(36),
        text VARCHAR2(2000 CHAR) NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
        PRIMARY KEY (threadID),
        FOREIGN KEY (author) REFERENCES Profile(email) ON DELETE SET NULL,
        FOREIGN KEY (donutID, postOrder) REFERENCES Post(donutID, postOrder) ON DELETE CASCADE,
        FOREIGN KEY (parent) REFERENCES Thread(threadID) ON DELETE CASCADE)`,
    `CREATE TABLE ThreadReaction(
        profile VARCHAR2(255 CHAR),
        threadID CHAR(36),
        emoji VARCHAR2(16 CHAR) NOT NULL,
        PRIMARY KEY (profile, threadID, emoji),
        FOREIGN KEY (profile) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (threadID) REFERENCES Thread(threadID) ON DELETE CASCADE)`
]

export async function dropAllTables() {
    return await withOracleDB(async (connection) => {
        try {
            for (let i= 0; i < DROP_QUERIES.length; i++) {
                try {
                    await connection.execute(DROP_QUERIES[i])
                } catch (err){ 
                    console.log(err)
                }
            }
            return "successfully dropped all tables"
        } catch(err) {
            console.log('Error');
        }
    }).catch((err) => {
        return err;
    });
}

export async function createTable() {
    return await withOracleDB(async (connection) => {
        try {
            console.log('starting creations')

            for(let i= 0; i < CREATE_QUERIES.length; i++) {
                try {
                    await connection.execute(CREATE_QUERIES[i])
                } catch (err) {
                    console.log(err);
                }
            }
            return 'Successfully create tables';
        } catch (err) {
            console.log('error creating table', err)
        }
    }).catch((err) => {
        return err;
    });
}

export async function insertHobbies() {
    return await withOracleDB(async (conn) => {
        try {
            console.log('inserting hobbies')

            for (let i = 0; i < INSERT_HOBBIES.length; i++) {
                try {
                    await conn.execute(INSERT_HOBBIES[i], {}, {autoCommit: true})
                } catch (err) {
                    console.log(err);
                }
            }
            return 'Successfully inserted hobbies';
        } catch (err) {
            console.log('error inserting hobbies', err)
        }
    }).catch((err) => {
        return err;
    })
}

export async function insertDemo() {
    return await withOracleDB(async (conn) => {
        try {
            console.log('inserting all data')

            for (let i = 0; i < INSERT_ALL.length; i++) {
                try {
                    await conn.execute(INSERT_ALL[i], {}, {autoCommit: true})
                } catch (err) {
                    console.log(err);
                }
            }
            return 'Successfully inserted all data';
        } catch (err) {
            console.log('error inserting all data', err)
        }
    }).catch((err) => {
        return err;
    })
}

/**
 * 
 * @param {*} arr the array to select an item from randomly
 * @returns an item from the array selected randomly, or false if arry is empty
 */
function returnRandom(arr) {
    if (arr.length == 0) {
        return false;
    }
    let maxIndex = arr.length - 1;
    let randomIndex = Math.floor(Math.random() * maxIndex);
    return arr[randomIndex];
}

export async function makeRandomPairings() {
    return await withOracleDB(async (connection) => {
        try {
            console.log('creating pairings')

            let profilesToBePaired;
            try {
                const result = await connection.execute(`SELECT email FROM Profile WHERE enabled=1`)
                profilesToBePaired = result.rows
            } catch (err) {
                console.log(err);
            }

            let pairs = [];

            while(profilesToBePaired.length > 0) {
                let pair = []

                const firstProfile = returnRandom(profilesToBePaired);
                pair.push(firstProfile)
                const fpi = profilesToBePaired.indexOf(firstProfile);
                profilesToBePaired.splice(fpi,1)

                const secondProfile = returnRandom(profilesToBePaired);
                if (secondProfile) {
                    // possibly the last element, thus check
                    pair.push(secondProfile);
                    const spi = profilesToBePaired.indexOf(secondProfile);
                    profilesToBePaired.splice(spi,1)
                    
                    // else, already at 0 index, will break from loop
                } else {
                    pair.push(null);
                }

                pairs.push(pair);
            }

            console.log(pairs);

            for (let i = 0; i < pairs.length; i++) {
                try {
                    // 1. create donut - populate `Donut`
                    console.log('Im creating a donut for ', pairs[i][0], ' and ', pairs[i][1])

                    const donutID = uuidv4();
                    const createdAt = sqlifyDate(new Date());

                    console.log(`INSERT INTO Donut VALUES (${donutID}, ${createdAt})`)
                    await connection.execute(
                        `INSERT INTO Donut (donutID, createdAt) VALUES (:donutID, TO_DATE(:createdAt))`, {
                            donutID,
                            createdAt
                        }, {
                            autoCommit: true
                        });

                    // 2. assign the pair - populate `AssignedTo`
                    console.log('Im assigning the two pairs together')
                    for (let j = 0; j < 2; j++) {
                        const profile =  pairs[i][j];
                        if (profile != null) {
                            // there exists this user (could be solo, for debugging purposes)
                            console.log(`INSERT INTO AssignedTo VALUES (${donutID}, ${profile})`)
                            await connection.execute(
                                `INSERT INTO AssignedTo (donutID, profile) VALUES (:donutID2, :profile)`, {
                                    donutID2: donutID,
                                    profile: `${profile}`
                                }, {
                                    autoCommit: true
                                })
                        }
                    }
                    // 3. mark as assigned - populate `BeenPaired`
                    if (pairs[i][0] != null && pairs[i][1] != null) {
                        console.log('Im creating a BeenPaired record')
                        await connection.execute(
                            `INSERT INTO BeenPaired(profileA, profileB, pairedDate) VALUES (:profileA, :profileB, :pairedDate)`, {
                                profileA: `${pairs[i][0]}`,
                                profileB: `${pairs[i][1]}`,
                                pairedDate: `${createdAt}`
                            }
                        )
                    }
                } catch (err) {
                    console.log(err);
                } 
            }
            

            return 'Successfully all possible donut pairings';
        } catch (err) {
            console.log('error creating donut pairings', err)
        }
    }).catch((err) => {
        return err;
    })
}