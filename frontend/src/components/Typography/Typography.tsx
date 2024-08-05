import styles from './Typography.module.css'

// Used at top of main/directly navigable screens
const Title = ({ children }: { children?: any }) => (
    <h1 className={styles.h1}>
        {children}
    </h1>
)
// Used at top of main/directly navigable screens
const Subtitle = ({ children }: { children?: any }) => (
    <h2 className={styles.h2}>
        {children}
    </h2>
)

// Used for post title
const Header1 = ({children}:{children?: any}) => (
    <h3 className={styles.h3}>
        {children}
    </h3>
)

const P = ({children, bold, small, dark, style}:{children?:any, bold?: boolean, small?: boolean, dark?: boolean, style?: any}) => (
    <p className={`${styles.p} ${bold ? styles.bold : ''} ${small ? styles.small : ''} ${dark ? styles.dark : ''}`} style={style}>
        {children}
    </p>
)

export {
    Title,
    Subtitle,
    Header1,
    P
}