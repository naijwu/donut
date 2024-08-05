import { useState, useEffect } from 'react';
import DonutCard from "@/components/DonutCard/DonutCard";
import { Title } from "@/components/Typography/Typography";
import { Donut } from "@/lib/types";
import { useAuthContext } from "@/utility/Auth";
import styles from './FeedScreen.module.css';
import axios from 'axios';

export default function FeedScreen({
    donuts: initialDonuts
}: {
    donuts: Donut[]
}) {
    const { user } = useAuthContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDonuts, setFilteredDonuts] = useState(initialDonuts);

    useEffect(() => {
        const fetchFilteredDonuts = async () => {
            try {
                // TODO: MAKE API
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/search/${searchTerm}`, {
                    withCredentials: true
                });
                setFilteredDonuts(res.data);
            } catch (err) {
                console.error("Failed to fetch filtered donuts:", err);
            }
        };

        if (searchTerm) {
            fetchFilteredDonuts();
        } else {
            setFilteredDonuts(initialDonuts);
        }
    }, [searchTerm, initialDonuts]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className={styles.wrapper}>
            <Title>
                Welcome,<br />{user?.name}
            </Title>
            <input
                className={styles.searchInput}
                type="text"
                placeholder="Search Posts..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            { filteredDonuts ? 
                <div className={styles.container}>
                    {filteredDonuts.map((d, i) => (
                        <DonutCard key={i} data={d} />
                    ))}
                </div> :
                <div>No Donuts Available</div>
            }
        </div>
    );
}
