import Login from '@/components/Login'
import styles from './AuthScreen.module.css'

export default function AuthScreen() {

    return (
        <div className={styles.wrapper}>
            <div className={styles.donut}>
                🍩
            </div>
            <Login />
        </div>
    )
}