import { observer } from 'mobx-react-lite'
import { SyntheticEvent } from 'react'
import { Button, Reveal } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'

interface Props {
    profile: Profile
}


export default observer(function FollowButton({ profile }: Props) {
    const { profileStore: { updateFollowing, loading }, userStore} = useStore()
    
    function handleFollow(e: SyntheticEvent, userName: string) {
        e.preventDefault();
        profile.following ? updateFollowing(userName, false) : updateFollowing(userName, true)
    }

    if (userStore.user?.userName ===profile.userName) return null;
    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button 
                    fluid 
                    color='teal' 
                    content={profile.following ? 'Following' : 'Not Following'} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button 
                    fluid 
                    basic 
                    color={profile.following ? 'red' : 'green'} 
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.userName)}
                />
            </Reveal.Content>
        </Reveal>
    )
})
