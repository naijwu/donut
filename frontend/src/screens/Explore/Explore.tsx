import { useEffect, useState } from 'react';
import styles from './Explore.module.css'
import { P, Subtitle, Title } from "@/components/Typography/Typography";
import Button from '@/components/Button/Button';
import axios from 'axios';
import { useAuthContext } from '@/utility/Auth';
import Avatar from '@/components/Avatar/Avatar';

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
            if (data[0]) {
                setPartner({
                    email: data[0][0],
                    fullName: data[0][1],
                    pictureURL: data[0][2]
                })
            } else {
                alert('no partner found!')
            }
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
    console.log(tables)

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
    const [attr, setAttr] = useState<any>('major');
    const [attrVal, setAttrVal] = useState<string>('');
    const [profileCount, setProfileCount] = useState<any>();
    async function handleProfileCount() {
        if(loading) return
        setLoading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/profileCount/${attr}`, {
                value: attr=="year" ? parseInt(attrVal) : attrVal
            }, {
                withCredentials: true
            });
            
            setProfileCount(data[0])
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const [inserts, setInserts] = useState<any>([]);
    async function handleGenerate() {
        const tables = [
            "POSTALLOCATION",
            "PROFILE",
            "BEENPAIRED",
            "BLACKLIST",
            "DONUT",
            "ASSIGNEDTO",
            "POST",
            "PICTURE",
            "MESSAGE",
            "HOBBY",
            "PROFILEHOBBY",
            "NOTIFICATION",
            "POSTREACTION",
            "THREAD",
            "THREADREACTION"
        ];
        if(loading) return
        setLoading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/explore/all`, {
                tables
            }, {
                withCredentials: true
            });
            
            setInserts(data);
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
                Generate
            </Subtitle>
            <P>Generate insert statements for all data</P>
            <Button onClick={handleGenerate} size="medium" variant="solid">
                Generate
            </Button>
            {Object.keys(inserts)?.map((k) => {
                return inserts[k]?.map((statement: string) => <div>{statement}</div>)
            })}
            <Subtitle>
                Find your partner
            </Subtitle>
            <P>Find someone with your exact same hobbies</P>
            <div>
                <Button onClick={handleFindPartner} size="medium" variant="solid">
                    Find now
                </Button>
                {partner && (
                    <div className={styles.partner}>
                        <Avatar pictureURL={partner?.pictureURL} name={partner?.fullName} />
                        <div className={styles.partnerInner}>
                            <P dark  bold>
                                {partner?.fullName}
                            </P>
                            <P dark>
                                {partner?.email}
                            </P>
                        </div>
                    </div>
                )}
            </div>
            <Subtitle>
                Statistics
            </Subtitle>
            <P>Get number of profiles of a specific attribute (major, gender, year)</P>
            <div>
                <P dark>Attribute</P>
                <select value={attr} onChange={e=>setAttr(e.target.value)}>
                    <option value="major">Major</option>
                    <option value="year">Year</option>
                    <option value="gender">Gender</option>
                </select>
                <P>
                    Value
                </P>
                <input 
                    name="major"
                    value={attrVal}
                    onChange={e=>setAttrVal(e.target.value)}
                    placeholder={attr == 'major' ? 'e.g. math' : attr == 'year' ? 'e.g. 3' : 'e.g. male'} />
                <Button onClick={handleProfileCount} size="medium" variant="solid">
                    Find now
                </Button>
                <div>Number of profiles: {profileCount || 0}</div>
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