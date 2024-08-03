import OutsideAlerter from '@/utility/OutsideAlerter';
import { useState } from 'react';
import Button from '../Button/Button';
import { P } from '../Typography/Typography';
import styles from './Reaction.module.css'

const REACTION_OPTIONS = ['❤️','✅','✨','🔥','😭','😊','💀','😂']

export default function Reaction({
    onClick
}: {
    onClick: (arg0: string) => void
}) {

    // later, can add an emoji picker library (there are a couple good ones)
    //      but for now, users can only use predefined emojis
    const [open, setOpen] = useState<boolean>(false);
    
    return (
        <OutsideAlerter onClickOutside={()=>setOpen(false)}>
            <div className={styles.wrapper}>
                <Button size="small" variant="ghost" className={styles.label} onClick={()=>setOpen(true)}>
                    + React
                </Button>
                <div className={`${styles.tray} ${open ? styles.open : ''}`}>
                    {REACTION_OPTIONS.map((r,index: number) => (
                        <div key={index} onClick={()=>onClick(r)} className={styles.emoji}>
                            {r}
                        </div>
                    ))}
                </div>
            </div>
        </OutsideAlerter>
    )
}