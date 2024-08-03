import styles from './Author.module.css'
import Avatar from "../Avatar/Avatar";
import { P } from '../Typography/Typography';

type AuthorT = {
    author: any;
    createdAt: string;
}

export default function Author({
    author,
    createdAt
}: AuthorT) {

    return (
        <div className={styles.author}>
            <Avatar pictureURL={author?.pictureURL} />
            <div className={styles.author_text}>
                <P small bold>
                    {author?.email || 'A user'}
                </P>
                {/* <P small>
                    on
                </P>
                <P bold small>
                    {createdAt}
                </P> */}
            </div>
        </div>
    )
}