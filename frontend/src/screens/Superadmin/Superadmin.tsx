import { useEffect, useState } from 'react';
import styles from './Superadmin.module.css'
import { P, Title } from "@/components/Typography/Typography";

export default function SuperadminScreen({
    tables,
    columns,
    projectColumns
}: {
    tables: any,
    columns: any,
    projectColumns: any
}) {
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [result, setResult] = useState<any[]>([]);

    useEffect(() => {
        if (selectedTable) {
            // Handle the case when a table is selected, e.g., fetch columns
            console.log(`Selected table: ${selectedTable}`);
        }
    }, [selectedTable]);

    return (
        <div className="App">
            <Title>Admin Interface</Title>
            <P>Acces user and donut information</P>
            <div>
                <label htmlFor="table-select">Select Table: </label>
                <select
                    id="table-select"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                >
                    <option value="">--Select a table--</option>
                    {tables && tables.map((table: string, index: number) => (
                        <option key={index} value={table}>
                            {table}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}