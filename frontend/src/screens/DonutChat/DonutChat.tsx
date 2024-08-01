import styles from './DonutChat.module.css'

export default function DonutChatScreen() {

    return (
        <div>
            donut chatroom
            {/* Profile Images */}
            {/* Donut Name - Edit*/}
            {/* Text */}
            {/* Chat Messages */}
            {/* Send Message Input */}
            <div>
                <input className={styles.chatBoxInput} placeholder='Send Message...' />
            </div>
        </div>
    )
}