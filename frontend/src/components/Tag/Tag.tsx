import styles from './Tag.module.css'

type TagT = {
    type: 'social' | 'study' | 'any',
}

const tagToLabel = {
    'social': 'Social Donut',
    'study': 'Study Donut',
    'any': 'General Donut'
}

export default function Tag({
    type
}: TagT) {

    return (
        <div className={`${styles.base} ${styles[type]}`}>
            {tagToLabel[type]}
        </div>
    )
}