
// User
export interface User {
    fullName?: string,
    pictureUrl?: string
}

// Notifications
export interface Notification {
    causer: string;
    pictureUrl: string;
    notificationID: string;
    time: any;
    message: string;
}

// Donut, Donut + Post
export interface Donut {
    donutID: any,
    createdAt: any,
    isCompleted: any,
    name?: string,
    posts?: DonutPost[],
    members?: User[]
}

export interface DonutPost {
    donutID: any,
    title: string,
    postOrder: number,
    description: string,
    author: string,
    createdAt: string
}

// Threads
export type ThreadData = {
    author: any;
    pictureUrl?: string;
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