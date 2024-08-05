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
    });

    const [validHobbies, setValidHobbies] = useState<typeof hobbies>(hobbies);

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
    
    const [selectedHobbyCategory, setSelectedHobbyCategory] = useState('');

    const [hobbyStartsWith, setHobbyStartsWith] = useState('');
    
    const handleHobbyCategoryChange = (event: any) => {
        const value = event.target.value;
        setSelectedHobbyCategory(value);
        console.log('Selected hobby:', value);
    };

    const handleSearchChange = (event: any) => {
        setHobbyStartsWith(event.target.value);
    };

    const handleSubmitSearch = () => {
        requeryHobbies()
    }

    async function requeryHobbies() {
        try {
            const searchTerm = hobbyStartsWith || '-';
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${searchTerm}/${selectedHobbyCategory}/findHobby`, {
                withCredentials: true
            });
            console.log(res.data)
            setValidHobbies(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    // Address - have to seperate address due to fk constraint (i.e. cannot add a postal code w/ no valid address)
    const [city, setCity] = useState<string>('');
    const [province, setProvince] = useState<string>('');

    async function handleCreateAddress() {
        console.log(city, province, editedProfile.postalCode)
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${city}/${province}/${editedProfile.postalCode}/createAddy`, {
                withCredentials: true
            });
            console.log('Returned Address');
            setCity(res.data);
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
                          value={editedProfile?.gender || 'unspecified'} 
                          onChange={e=>{handleEditField('gender', e.target.value);console.log(e.target.value)}}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unspecified">Unspecified</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            City
                        </P>
                        <input 
                          type="text" 
                          placeholder={city || "Your city..."} 
                          value={city}
                          onChange={e=>setCity(e.target.value)} />
                        <P dark>
                            Province
                        </P>
                        <input 
                          type="text" 
                          placeholder={province || "Your province..."} 
                          value={province}
                          onChange={e=>setProvince(e.target.value)} />
                        <P dark>
                            Postal Code
                        </P>
                        <input 
                          type="text" 
                          placeholder={profile[ProfileCols.postalCode] || "Your postal code..."} 
                          value={editedProfile?.postalCode || ''}
                          onChange={e=>handleEditField('postalCode', e.target.value)} />
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
                    
                    <div>
                        <P>Select a Hobby</P>
                        <select value={selectedHobbyCategory} onChange={handleHobbyCategoryChange}>
                            <option value="" disabled>Select an option</option>
                            {hobbyCategories.map((category) => (
                                <option value={category.value}>
                                    {category.value}
                                </option>
                            ))}
                        </select>
                        {selectedHobbyCategory && (
                            <div>
                                <P dark>You have selected: {selectedHobbyCategory}</P>
                            </div>
                        )}
                        <div>   
                            <P>Search for a Hobby</P>
                        </div>
                        <input
                            type="text"
                            value={hobbyStartsWith}
                            onChange={handleSearchChange}
                            placeholder="Type a hobby..."
                        />
                        <div>
                            <P dark>Searching for: {hobbyStartsWith}</P>
                        </div>
                        <button onClick={handleSubmitSearch}>Filter Hobbies</button>
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

                    <div className={styles.hobbiesList}>
                        {hobbies?.map((hobby: any) => (
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