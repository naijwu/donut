import { withOracleDB } from "./demoService.js";

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

const CREATE_QUERIES = [
    `CREATE TABLE PostalLocation(
        postalCode CHAR(6),
        city VARCHAR2(255 CHAR),
        province VARCHAR2(255 CHAR),
        PRIMARY KEY (postalCode))`,
    `CREATE TABLE Profile(
        email VARCHAR2(255 CHAR),
        pictureURL VARCHAR2(1000 CHAR),
        gender CHAR(6) NOT NULL,
        age INT NOT NULL,
        fullName VARCHAR2(255 CHAR) NOT NULL,
        enabled CHAR(1) DEFAULT '1' NOT NULL,
        year INT NOT NULL,
        major VARCHAR2(255 CHAR) NOT NULL,
        settings VARCHAR2(255 CHAR),
        address VARCHAR2(255 CHAR),
        postalCode CHAR(6),
        PRIMARY KEY (email),
        FOREIGN KEY (postalCode) REFERENCES PostalLocation(postalCode)
        ON DELETE SET NULL)`,
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
        description VARCHAR2(255 CHAR) NOT NULL,
        PRIMARY KEY (donutID, postOrder),
        FOREIGN KEY (author) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (donutID) REFERENCES Donut(donutID) ON DELETE SET NULL)`,
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
        sentAt DATE NOT NULL,
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
        PRIMARY KEY (profile, donutID, postOrder),
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
        PRIMARY KEY (profile, threadID),
        FOREIGN KEY (profile) REFERENCES Profile(email) ON DELETE CASCADE,
        FOREIGN KEY (threadID) REFERENCES Thread(threadID) ON DELETE CASCADE)`
]

export async function runQuery(query) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(query);
            return result;
        } catch(err) {
            console.log('Error');
        }
    }).catch((err) => {
        return err;
    });
}

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