import styles from './Typography.module.css'

// Used at top of main/directly navigable screens
const Title = ({ children }: { children?: any }) => (
    <h1 className={styles.h1}>
        {children}
    </h1>
)

// Used for post title
const Header1 = ({children}:{children?: any}) => (
    <h3 className={styles.h3}>
        {children}
    </h3>
)

const P = ({children, bold, small, dark}:{children?:any, bold?: boolean, small?: boolean, dark?: boolean}) => (
    <p className={`${styles.p} ${bold ? styles.bold : ''} ${small ? styles.small : ''} ${dark ? styles.dark : ''}`}>
        {children}
    </p>
)

export {
    Title,
    Header1,
    P
}