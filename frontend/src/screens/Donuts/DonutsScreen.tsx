import Button from "@/components/Button/Button";
import DonutBanner from "@/components/DonutBanner/DonutBanner";
import { Title } from "@/components/Typography/Typography";
import { List_DonutCols } from "@/lib/maps";
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
                    <Link key={donut[List_DonutCols.donutID]} href={`/donuts/${donut[List_DonutCols.donutID]}`}>
                        <DonutBanner partial={{
                            donutID: donut[List_DonutCols.donutID],
                            createdAt: donut[List_DonutCols.createdAt],
                            isCompleted: donut[List_DonutCols.isCompleted],
                            groupName: donut[List_DonutCols.groupName],
                            members: [
                                {
                                    email: donut[List_DonutCols.member1],
                                    pictureURL: donut[List_DonutCols.member1picture],
                                    fullName: donut[List_DonutCols.member1name],
                                },
                                {
                                    email: donut[List_DonutCols.member2],
                                    pictureURL: donut[List_DonutCols.member2picture],
                                    fullName: donut[List_DonutCols.member2name],
                                }
                            ]
                        }} />
                    </Link>
                ))}
            </div>
        </div>
    )
}