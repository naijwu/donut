import DonutCard from "@/components/DonutCard/DonutCard";
import { Header1 } from "@/components/Typography/Typography";
import { useAuthContext } from "@/utility/Auth";

import styles from './FeedScreen.module.css'

export default function FeedScreen() {

    const { user } = useAuthContext();

    return (
        <div className={styles.wrapper}>
            <Header1>
                Welcome,<br/>{user?.name}
            </Header1>
            <div className={styles.container}>
                <DonutCard data={{
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
                }} />
            </div>
        </div>
    )
}