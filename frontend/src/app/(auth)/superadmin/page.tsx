"use client"

import SuperadminScreen from "@/screens/Superadmin/Superadmin";
// import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { table } from "console";
import { useEffect, useState } from "react";

export default function Superadmin() {
    // const { user } = useAuthContext();

    const [tables, setTables] = useState<string[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [projectColumns, setProjectColumns] = useState<any[]>([]);

    async function fetchData() {
        try {
            const tableResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/tables`, {
                withCredentials: true
            });

            setTables(tableResponse.data.tableNames);
        } catch (error) {
            console.error("could not get data: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // useEffect(() => {
    //     if (user) {
    //         fetchData();
    //     }
    // }, [user])

    return tables &&<SuperadminScreen tables={tables} columns={columns} projectColumns={projectColumns} />;
}