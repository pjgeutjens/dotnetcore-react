import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Tab, Header, Grid, Button } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'
import ProfileEditForm from './form/ProfileEditForm'

interface Props {
    profile: Profile
}


export default observer(function ProfileAbout({ profile }: Props) {
    const [editMode, seteditMode] = useState(false)
    const {profileStore: {isCurrentUser}} = useStore()
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {isCurrentUser && (
                        <Button floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => seteditMode(!editMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                        {editMode ? (
                            <ProfileEditForm setEditMode={seteditMode}/>
                        ) : (
                            <span style={{whiteSpace: 'pre-wrap'}}>{profile.bio}</span>
                        )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>

    )
})
