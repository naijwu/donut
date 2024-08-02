
// User
export interface Profile {
    email: string;
    fullName?: string;
    pictureURL?: string;
    gender?: string;
    age?: number;
    enabled?: any;
    year?: number;
    major?: string;
    settings?: string;
    address?: string;
    postalCode?: string;
}

// Notifications
export interface Notification {
    causer: string;
    pictureURL: string;
    notificationID: string;
    time: any;
    message: string;
}

// Donut, Donut + Post
export interface Donut {
    donutID: any,
    createdAt: any,
    isCompleted: any,
    groupName?: string,
    posts?: DonutPost[],
    members?: Profile[]
}

export interface DonutPost {
    donutID: any,
    title: string,
    postOrder: number,
    description: string,
    author: string;
    profile: {
        email: string;
        pictureURL: string;
        fullName: string;
    };
    createdAt: string;
    reactions: any; // a map
    images: {
        pictureURL: string;
        alt: string;
    }[]
}

// Threads
export type ThreadData = {
    author: any;
    reactions: any;
    profile: {
        email: string;
        pictureURL: string;
        fullName: string;
    };
    pictureURL?: string;
    threadID: any;
    createdAt: any;
    text: string;
    parentID?: any;
}
export type ThreadNode = {
    data: ThreadData;
    children?: ThreadNodeList;
}
export type ThreadNodeList = ThreadNode[];