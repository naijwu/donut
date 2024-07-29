import DonutCard from "@/components/DonutCard/DonutCard";
import { Title } from "@/components/Typography/Typography";
import { Donut } from "@/lib/types";
import { useAuthContext } from "@/utility/Auth";

import styles from './FeedScreen.module.css'

export default function FeedScreen({
    donuts
}: {
    donuts: Donut[]
}) {

    const { user } = useAuthContext();

    return (
        <div className={styles.wrapper}>
            <Title>
                Welcome,<br/>{user?.name}
            </Title>
            <div className={styles.container}>
                {donuts?.map((d,i) => (
                    <DonutCard key={i} data={d} />
                ))}
            </div>
        </div>
    )
}