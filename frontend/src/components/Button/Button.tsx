import styles from './Button.module.css'

type ButtonT = {
    size?: 'medium' | 'small',
    variant?: 'ghost' | 'solid',
    onClick: any;
    children: any,
    active?: boolean,
    disabled?: boolean,
    className?: any;
}

export default function Button({
    size = 'medium',
    variant = 'solid',
    children,
    onClick,
    active,
    disabled,
    className
}: ButtonT) {

    return (
        <button disabled={disabled} onClick={onClick} className={`${styles.base} ${styles[size]} ${styles[variant]} ${active ? styles.active : ''} ${className}`}>
            {children}
        </button>
    )
}