import { useEffect, useState } from 'react';
import styles from './Explore.module.css'
import { P, Subtitle, Title } from "@/components/Typography/Typography";
import Button from '@/components/Button/Button';
import axios from 'axios';
import { useAuthContext } from '@/utility/Auth';

export default function SuperadminScreen({
    tables
}: {
    tables: any,
    columns: any,
    projectColumns: any
}) {
    
    const { user } = useAuthContext();

    // Finding partner
    const [finding, setFinding] = useState<boolean>(false);
    const [partner, setPartner] = useState<any>();
    async function handleFindPartner() {
        if (finding || !user) return
        setFinding(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/findpartner/${user.email}`, {
                withCredentials: true
            })
            setPartner(data)
            setFinding(false);
        } catch (error) {
            console.error(error);
            setFinding(false);
        }
    }

    // Selecting tables
    const [table, setTable] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [attributes, setAttributes] = useState<string[]>([])
    const [selected, setSelected] = useState<string[]>([]);
    const [projected, setProjected] = useState<any>();

    async function getCols(table: string) {
        if (loading) return
        if (!table) return
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/${table}/columns`, {
                withCredentials: true
            })
            setAttributes(data)
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleAttribute=(a: string) => {
        const updated = JSON.parse(JSON.stringify(selected))
        if (selected.includes(a)){
            updated.splice(selected.indexOf(a), 1)
        } else {
            updated.push(a);
        }
        setSelected(updated);
    }
    
    async function handleProjection() {
        if (loading) return
        if (!table) return
        setLoading(true);
        try {
            console.log('attrs: ', selected)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/${table}/projection`, {
                attributes: selected
            }, {
                withCredentials: true
            })
            setProjected(data)
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }
    
    useEffect(() => {
        if (!loading) {
            getCols(table)
        }
    }, [table])

    // Group by (aggregation) - users with x,y,z

    const [major, setMajor] = useState<any>();
    const [year, setYear] = useState<any>();
    const [gender, setGender] = useState<any>();

    const [profileCount, setProfileCount] = useState<any>();

    async function handleProfileCount() {
        console.log(major, year, gender)
        setLoading(true);
        try {
            const data = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/${major}/${year}/${gender}/profileCount`, {
                withCredentials: true
            });
            
            console.log('Received data:', data);
            setProfileCount(data.data.profileCount)
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <Title>Explore</Title>
            <Subtitle>
                Statistics
            </Subtitle>
            <P>Get number of profiles of a specific attribute (major, gender, year)</P>
            <div>
                <select>
                    <option value=""></option>
                </select>
                <div>
                    <P dark>Major</P>
                    <input 
                        name="major"
                        value={major}
                        onChange={e=>setMajor(e.target.value)}
                        placeholder='e.g. math' />
                </div>
                <div>
                    <P dark>Year</P>
                    <input 
                        type="number" 
                        name="year"
                        value={year}
                        onChange={e=>setYear(e.target.value)}
                        placeholder='e.g. 3' />
                </div>
                <div>
                    <P dark>Gender</P>
                    <select 
                        name="gender"
                        value={gender}
                        onChange={e=>setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unspecified">Unspecified</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <Button onClick={handleProfileCount} size="medium" variant="solid">
                    Find now
                </Button>
                <div>Number of profiles: {profileCount}</div>
            </div>
            <Subtitle>
                Are you old?
            </Subtitle>
            <P>Discover avg year of students of an attribute (major, gender)</P>
            <div>
                <select>
                    <option value=""></option>
                </select>
                <Button onClick={()=>{}} size="medium" variant="solid">
                    Find now
                </Button>
                {}
            </div>
            <Subtitle>
                Find your partner
            </Subtitle>
            <P>Find someone with your exact same hobbies</P>
            <div>
                <Button onClick={handleFindPartner} size="medium" variant="solid">
                    Find now
                </Button>
                {JSON.stringify(partner)}
            </div>
            <Subtitle>
                God mode
            </Subtitle>
            <P>Access all user data</P>
            <P dark>Table to access:</P>
            <div>
                <select defaultValue={tables[0] || ''} disabled={loading} onChange={e=>{setTable(e.target.value);setSelected([])}}>
                    {tables?.map((t: string) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <P dark>Attributes to find:</P>
            <div>
                <div className={styles.selector}>
                    {attributes?.length > 0 ? attributes?.map((a: string) => (
                        <div key={a} onClick={()=>handleAttribute(a)} className={`${styles.attrItem} ${selected.includes(a) ? styles.active : ''}`}>{a}</div>
                    )) : 'No attributes'}
                </div>
                <Button onClick={handleProjection}>
                    Get results
                </Button>
                {JSON.stringify(projected)}
            </div>
        </div>
    );
}