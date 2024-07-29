import styles from './Typography.module.css'

const Header1 = ({ children }: { children?: any }) => (
    <h1 className={styles.h1}>
        {children}
    </h1>
)

const P = ({children, bold, small}:{children?:any, bold?: boolean, small?: boolean}) => (
    <p className={`${styles.p} ${bold ? styles.bold : ''} ${small ? styles.small : ''}`}>
        {children}
    </p>
)

export {
    Header1,
    P
}