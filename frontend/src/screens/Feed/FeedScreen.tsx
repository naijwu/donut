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
    const [number, setNumber] = useState<string | undefined>(undefined);
    const [course, setCourse] = useState('');
    const [suggestedActivity, setSuggestedActivity] = useState('');
    const [filteredDonuts, setFilteredDonuts] = useState(initialDonuts);

    const fetchFilteredDonuts = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/filterPost/${searchTerm}`, {
                withCredentials: true
            });
            setFilteredDonuts(res.data);
        } catch (err) {
            console.error("Failed to fetch filtered donuts:", err);
        }
    };

    useEffect(() => {
        if (!searchTerm) {
            setFilteredDonuts(initialDonuts);
        }
    }, [searchTerm, initialDonuts]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(event.target.value);
    };

    const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourse(event.target.value);
    };

    const handleSuggestedActivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuggestedActivity(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // fetch the filtered data based on the filters
        await fetchFilteredDonuts();
    };

    return (
        <div className={styles.wrapper}>
            <Title>
                Welcome,<br />{user?.name}
            </Title>
            <form onSubmit={handleSubmit}>
                <input
                    className={styles.filterInput}
                    type="text"
                    placeholder="Search Posts..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <input
                    className={styles.filterInput}
                    type="number"
                    placeholder="Number"
                    value={number}
                    onChange={handleNumberChange}
                />
                <input
                    className={styles.filterInput}
                    type="text"
                    placeholder="Course"
                    value={course}
                    onChange={handleCourseChange}
                />
                <input
                    className={styles.filterInput}
                    type="text"
                    placeholder="Suggested Activity"
                    value={suggestedActivity}
                    onChange={handleSuggestedActivityChange}
                />
                <button type="submit">Search</button>
            </form>
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
