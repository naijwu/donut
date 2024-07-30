import DonutBanner from "@/components/DonutBanner/DonutBanner";
import { Title } from "@/components/Typography/Typography";
import { Donut } from "@/lib/types";
import Link from "next/link";

export default function DonutsScreen({
    donuts
}: {
    donuts: Donut[]
}) {

    return (
        <div>
            <Title>
                Donuts
            </Title>
            <div style={{
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {donuts?.map((donut) => (
                    <Link key={donut.donutID} href={`/donuts/${donut.donutID}`}>
                        <DonutBanner partial={donut} />
                    </Link>
                ))}
            </div>
        </div>
    )
}