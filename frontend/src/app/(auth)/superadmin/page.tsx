"use client"

import SuperadminScreen from "@/screens/Superadmin/Superadmin";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Superadmin() {

    const [data, setData] = useState<any>();

    async function fetchData() {
        try {
            const { data } = await axios.get(``);
            setData(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (<SuperadminScreen />)
}