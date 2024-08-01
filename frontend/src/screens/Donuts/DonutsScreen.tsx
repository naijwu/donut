import DonutBanner from "@/components/DonutBanner/DonutBanner";
import { Title } from "@/components/Typography/Typography";
import { DonutCols } from "@/lib/maps";
import { Donut } from "@/lib/types";
import Link from "next/link";

export default function DonutsScreen({
    donuts
}: {
    donuts: any[]
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
                    <Link key={donut[DonutCols.donutID]} href={`/donuts/${donut[DonutCols.donutID]}`}>
                        <DonutBanner partial={{
                            donutID: [DonutCols.donutID],
                            createdAt: donut[DonutCols.createdAt],
                            isCompleted: donut[DonutCols.isCompleted]
                        }} />
                    </Link>
                ))}
            </div>
        </div>
    )
}