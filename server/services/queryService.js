import { withOracleDB } from "../dbConfig.js";
import { v4 as uuidv4 } from 'uuid';

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
    `INSERT INTO Hobby VALUES ('Hiking', 'Exploring nature by walking.')`,
    `INSERT INTO Hobby VALUES ('Anime', 'Discussing Japanese animation and manga.')`,
    `INSERT INTO Hobby VALUES ('Driving', 'Racing or commuting by vehicle.')`,
    `INSERT INTO Hobby VALUES ('Investing', 'Buying equities.')`,
    `INSERT INTO Hobby VALUES ('Running', 'Walking fast for fitness and enjoyment.')`,
    `INSERT INTO Hobby VALUES ('Singing', 'Enjoying vocal music.')`,
    `INSERT INTO Hobby VALUES ('Building', 'Creating various projects.')`,
    `INSERT INTO Hobby VALUES ('Weightlifting', 'Lifting weights.')`
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
        sentAt TIMESTAMP NOT NULL,
        sender VARCHAR2(255 CHAR) NOT NULL,
        PRIMARY KEY (messageID),
        FOREIGN KEY (donutID) REFERENCES Donut(donutID) ON DELETE CASCADE,
        FOREIGN KEY (sender) REFERENCES Profile(email) ON DELETE CASCADE)`,
    `CREATE TABLE Hobby(
        name VARCHAR2(255 CHAR),
        description VARCHAR2(255 CHAR) NOT NULL,
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
        createdAt DATE NOT NULL,
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

const SMC = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
/**
 * 
 * @param {*} date the date to turn into SQL date format
 * @returns a string compatible with SQL date format
 */
export function sqlifyDate(date) {

    const pad = (num) => ('00'+num).slice(-2)
    const newDate = pad(date.getUTCDate()) + '-' + 
                    SMC[date.getUTCMonth()] + '-' +
                    date.getUTCFullYear()
                    
    return newDate;
}

/**
 * 
 * @param {*} date the date to turn into SQL date format
 * @returns a string compatible with SQL date format
 */
function sqlifyDatetime(date) {
    const pad = (num) => ('00'+num).slice(-2)
    const newDate = date.getUTCFullYear() + '-' +
                    pad(date.getUTCMonth() + 1) + '-' +
                    pad(date.getUTCDate()) + ' ' +
                    pad(date.getUTCHours()) + ':' +
                    pad(date.getUTCMinutes()) + ':' +
                    pad(date.getUTCSeconds());
    return newDate;
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