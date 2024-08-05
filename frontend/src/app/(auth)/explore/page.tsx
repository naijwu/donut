"use client"

import ExploreScreen from "@/screens/Explore/Explore";
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Explore() {
    const { user } = useAuthContext();

    const [tables, setTables] = useState<string[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [projectColumns, setProjectColumns] = useState<any[]>([]);

    async function fetchData() {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/tables`, {
                withCredentials: true
            });

            setTables(data);
        } catch (error) {
            console.error("could not get data: ", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user])

    return tables && <ExploreScreen tables={tables} columns={columns} projectColumns={projectColumns} />;
}