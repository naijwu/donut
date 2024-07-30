import { Donut, Notification } from "./types"

export const DEMO_THREADS = [
    {
        threadID: '1',
        createdAt: 'July 10',
        text: 'im a comment',
        author: 'David lim',
        pictureUrl: '',
        parentID: null,
    },
    {
        threadID: '2',
        createdAt: 'July 11',
        text: 'im a reply 1',
        author: 'Donald Lee',
        pictureUrl: '',
        parentID: '1',
    },
    {
        threadID: '3',
        createdAt: 'July 12',
        text: 'im another reply',
        author: 'Jae Wu Chun',
        pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c',
        parentID: '1',
    },
    {
        threadID: '4',
        createdAt: 'July 15',
        text: 'im yet another comment',
        author: 'Donald Lee',
        pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c',
        parentID: null
    }
]

export const DEMO_FEED: Donut[] = [
    {
        donutID: '',
        createdAt: '',
        isCompleted: true,
        posts: [{
            donutID: '0',
            title: 'Went on an amazing hike today',
            description: 'You too should try touching some grass',
            postOrder: 1,
            author: 'Jae Wu Chun',
            createdAt: 'June 3rd 2024'
        },{
            donutID: '0',
            title: 'My feet hurt',
            description: 'because i used them at all',
            postOrder: 1,
            author: 'Jae Wu Chun',
            createdAt: 'June 3rd 2024'
        }],
        members: [{
            fullName: 'Jae Wu Chun',
            pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
        },{
            fullName: 'Jae Wu Chun',
            pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
        }]
    },{
        donutID: '',
        createdAt: '',
        isCompleted: true,
        posts: [{
            donutID: '0',
            title: 'Went on an amazing hike today',
            description: 'You too should try touching some grass',
            postOrder: 1,
            author: 'Jae Wu Chun',
            createdAt: 'June 3rd 2024'
        },{
            donutID: '0',
            title: 'My feet hurt',
            description: 'because i used them at all',
            postOrder: 1,
            author: 'Jae Wu Chun',
            createdAt: 'June 3rd 2024'
        }],
        members: [{
            fullName: 'Jae Wu Chun',
            pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
        },{
            fullName: 'Jae Wu Chun',
            pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
        }]
    }
]

export const DEMO_NOTIF: Notification[] = [
    {
        causer: 'Jae Wu Chun',
        pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c',
        notificationID: '1',
        message: 'Your post received a new comment',
        time: 'July 29, 2024 11:23 AM'
    },
    {
        causer: 'Donald Lee',
        pictureUrl: '',
        notificationID: '2',
        message: 'Your post was liked',
        time: 'July 29, 2024 11:24 AM'
    }
]

export const DEMO_DONUTS: Donut[] = [
    {
        donutID: '1',
        createdAt: 'June 10, 2024',
        isCompleted: true,
        name: 'hiking donut!',
        members: [
            {
                fullName: 'David Lim',
                pictureUrl: '',
            },
            {
                fullName: 'Jae Wu Chun',
                pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c',
            }
        ]
    },
    {
        donutID: '2',
        createdAt: 'May 24, 2024',
        isCompleted: true,
        name: 'lets play pool',
        members: [
            {
                fullName: 'David Lim',
                pictureUrl: '',
            },
            {
                fullName: 'Jae Wu Chun',
                pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c',
            }
        ]
    },
    {
        donutID: '3',
        createdAt: 'February 10, 2023',
        isCompleted: true,
        name: 'unnamed donut',
        members: [
            {
                fullName: 'David Lim',
                pictureUrl: '',
            },
            {
                fullName: 'Bonald Lee',
                pictureUrl: '',
            }
        ]
    },
]

export const DEMO_DONUT: Donut = {
    donutID: '',
    createdAt: '',
    isCompleted: true,
    posts: [{
        donutID: '0',
        title: 'Went on an amazing hike today',
        description: 'You too should try touching some grass',
        postOrder: 1,
        author: 'Jae Wu Chun',
        createdAt: 'June 3rd 2024'
    },{
        donutID: '0',
        title: 'My feet hurt',
        description: 'because i used them at all',
        postOrder: 1,
        author: 'Jae Wu Chun',
        createdAt: 'June 3rd 2024'
    }],
    members: [{
        fullName: 'Jae Wu Chun',
        pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
    },{
        fullName: 'Jae Wu Chun',
        pictureUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c'
    }]
}