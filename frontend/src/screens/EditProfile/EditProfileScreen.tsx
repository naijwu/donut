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
                          onChange={e=>handleEditField('year',e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Age
                        </P>
                        <input 
                          type="number" 
                          placeholder={profile[ProfileCols.age]  || 'Your age...'}
                          value={editedProfile?.age || 0}
                          onChange={e=>handleEditField('age',e.target.value)} />
                    </div>
                    <div className={styles.formControl}>
                        <P dark>
                            Gender
                        </P>
                        <select 
                          name="gender"
                          value={editedProfile?.gender || 'male'} 
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