import styles from './EditProfileScreen.module.css'
import { Header1, P, Title } from "@/components/Typography/Typography"
import Avatar from '@/components/Avatar/Avatar'
import { ProfileCols } from '@/lib/maps'
import { useAuthContext } from '@/utility/Auth'
import Button from '@/components/Button/Button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


export default function EditProfile({
    profile,
    profileHobbies,
    hobbies
}: {
    profile: any,
    profileHobbies: any;
    hobbies?: any
}) {

    const { user } = useAuthContext();
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [editedProfile, setEditedProfile] = useState({
        email: profile[ProfileCols.email],
        fullName: profile[ProfileCols.fullName],
        pictureURL: profile[ProfileCols.pictureURL],
        gender: profile[ProfileCols.gender],
        age: profile[ProfileCols.age],
        enabled: profile[ProfileCols.enabled],
        year: profile[ProfileCols.year],
        major: profile[ProfileCols.major],
        settings: profile[ProfileCols.settings],
        address: profile[ProfileCols.address],
        postalCode: profile[ProfileCols.postalCode],
        username: profile[ProfileCols.username],
    });

    const [validHobbies, setValidHobbies] = useState<any>(hobbies);

    const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profileHobbies?.map((h: any)=>h[1]));

    const handleEditField = (key: string, value: any) => {
        const newProfile = JSON.parse(JSON.stringify(editedProfile));
        newProfile[key] = value;
        setEditedProfile(newProfile);
    }

    const handleHobby = (hobby: string) => {
        const updatedHobbies: string[] = JSON.parse(JSON.stringify(selectedHobbies));
        if (updatedHobbies.includes(hobby)) {
            updatedHobbies.splice(selectedHobbies.indexOf(hobby), 1);
        } else {
            updatedHobbies.push(hobby);
        }
        setSelectedHobbies(updatedHobbies);
    }

    async function handleSave() {
        if(loading || !user?.email) return;
        setLoading(true);

        // await handleCreateAddress();

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${user.email}`, {
                profile: editedProfile,
                hobbies: selectedHobbies
            }, {
                withCredentials: true
            })

            console.log('Saved');
            setLoading(false);
            router.push(`/profile/${user.email}`)
        } catch (err) {
            alert("Error saving profile! Your username may be taken!");
            console.error(err)
            setLoading(false);
        }
    }

    // DROPDOWN HOBBIES
    const hobbyCategories = [
        { value: 'Sports' },
        { value: 'Music' },
        { value: 'Art' },
        { value: 'Media' },
        { value: 'Gaming' },
        { value: 'Other' }
    ];
    
    const [hobbySearch, setHobbySearch] = useState<string>('');

    const validateSearch = () => {
        if(hobbySearch.replace(/ /g,'').length == 0) return false

        let isValid = true;
        const statements = hobbySearch.split(/(\|\||&&)/)
        for (let i = 0; i < statements.length; i++) {
            const lhsrhs: any = statements[i].split('==')
            if (lhsrhs.length == 1) {
                // can't terminate with an operator
                if (i == statements.length - 1) isValid = false;
                // invalid operator
                if (!(statements[i].includes('&&') || statements[i].includes('||'))) isValid = false;
            } else {
                // invalid attribute/col to query
                if(!['name','description','category'].includes(lhsrhs[0].toLowerCase())) isValid = false;
            }
        }
        return isValid;
    }
    async function handleSearch() {
        const isValid = validateSearch();
        if(!isValid ){
            alert('Bad search')
            return
        }
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/hobbies/search`, {
                search: hobbySearch
            }, {
                withCredentials: true
            });
            setValidHobbies(data);
        } catch (err) {
            console.error(err);
        }
    }
    async function handleReset() {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/hobbies`, {
                withCredentials: true
            });
            setValidHobbies(data);
        } catch (err) {
            console.error(err);
        }
    }

    return profile ? (
        <div className={styles.wrapper}>
            <Title>
                Edit Profile
            </Title>
            <P>
                {profile[ProfileCols.email]}
            </P>
            <div className={styles.container}>
                <div className={styles.about}>
                    <Avatar pictureURL={profile[ProfileCols.pictureURL]} size="xlarge" />
                </div>
                <div className={styles.info}>
                    <div className={styles.formControl}>
                        <P dark>
                            Name
                        </P>
                        <input 
                          type="text" 
                          placeholder={profile[ProfileCols.fullName] || "Your name..."} 
                          value={editedProfile?.fullName || ''}
                          onChange={e=>handleEditField('fullName', e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Username
                        </P>
                        <input 
                          type="text" 
                          placeholder={profile[ProfileCols.username] || "Your username..."} 
                          value={editedProfile?.username || ''}
                          onChange={e=>handleEditField('username', e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Major
                        </P>
                        <input 
                          type="text" 
                          placeholder={profile[ProfileCols.major] || 'Your major...'}
                          value={editedProfile?.major || ''}
                          onChange={e=>handleEditField('major',e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Year
                        </P>
                        <input 
                          type="number" 
                          placeholder={profile[ProfileCols.year] || 'Your year standing...'}
                          value={editedProfile?.year || 0}
                          onChange={e=>handleEditField('year',e.target.value)}
                          min='1'
                          max='8' />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Age
                        </P>
                        <input 
                          type="number" 
                          placeholder={profile[ProfileCols.age]  || 'Your age...'}
                          value={editedProfile?.age || 0}
                          onChange={e=>handleEditField('age',e.target.value)}
                          min='1' />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Gender
                        </P>
                        <select 
                          name="gender"
                          value={editedProfile?.gender} 
                          onChange={e=>{handleEditField('gender', e.target.value);console.log(e.target.value)}}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Donuts
                        </P>
                        <div className={styles.checkbox}>
                            <input 
                                name="donut"
                                type="checkbox" 
                                checked={editedProfile?.enabled}
                                onChange={()=>handleEditField('enabled', editedProfile?.enabled == 1 ? 0 : 1)} />
                            <P>
                                Get paired?
                            </P>
                        </div>
                    </div>
                </div>
                <div className={styles.hobbies}>
                    <P bold>
                        Hobbies
                    </P>
                    
                    <div className={styles.formControl}>
                        <P>Advanced search</P>
                        <input
                            type="text"
                            value={hobbySearch}
                            onChange={e=>setHobbySearch(e.target.value)}
                            placeholder="e.g. category==Music && category==Art"
                        />
                        <Button onClick={handleSearch}>Filter Hobbies</Button>
                        {validHobbies?.length != hobbies?.length && (
                            <Button onClick={handleReset}>Reset</Button>
                        )}
                    </div>

                    <div className={styles.hobbiesList}>
                        {validHobbies?.map((hobby: any) => (
                            <div 
                              key={hobby[0]} 
                              className={`${styles.hobby} ${selectedHobbies?.includes(hobby[0]) ? styles.active : ''}`}
                              onClick={()=>handleHobby(hobby[0])}>
                                <P small dark>
                                    {hobby[0]}
                                </P>
                                <P small>
                                    {hobby[1]}
                                </P>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {profile[ProfileCols.email] == user?.email && (
                <div className={styles.floatie}>
                    <div className={styles.floatieInner}>
                        <Button onClick={handleSave} size="medium" variant="solid">
                            Save profile
                        </Button>
                    </div>
                </div>
            )}
        </div>
    ) : <></>
}