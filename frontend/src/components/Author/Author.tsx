import styles from './Author.module.css'
import Avatar from "../Avatar/Avatar";
import { P } from '../Typography/Typography';

type AuthorT = {
    author: string;
    createdAt: string;
}

export default function Author({
    author,
    createdAt
}: AuthorT) {

    return (
        <div className={styles.author}>
            <Avatar pictureUrl='https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c' />
            <div className={styles.author_text}>
                <P small bold>
                    {author}
                </P>
                <P small>
                    on
                </P>
                <P bold small>
                    {createdAt}
                </P>
            </div>
        </div>
    )
}