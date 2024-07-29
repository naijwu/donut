

export interface User {
    fullName?: string,
    pictureUrl?: string
}

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