import styles from './Button.module.css'

type ButtonT = {
    size: 'medium' | 'small',
    variant: 'ghost' | 'solid',
    onClick: () => void,
    children: any,
    active?: boolean,
    disabled?: boolean
}

export default function Button({
    size = 'medium',
    variant = 'solid',
    children,
    onClick,
    active,
    disabled
}: ButtonT) {

    return (
        <button disabled={disabled} onClick={onClick} className={`${styles.base} ${styles[size]} ${styles[variant]} ${active ? styles.active : ''}`}>
            {children}
        </button>
    )
}