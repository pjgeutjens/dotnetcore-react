import { Form, Formik } from 'formik'
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea'
import MyTextInput from '../../../app/common/form/MyTextInput'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup'

interface Props {
    setEditMode: (editMode: boolean) => void
}

export default function ProfileEditForm({ setEditMode }: Props) {
    const { profileStore: { profile, updateProfile } } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required('The displayName is required'),
    })

    return (
        <Segment clearing>
            <Formik enableReinitialize
                validationSchema={validationSchema}
                initialValues={{
                    displayName: profile?.displayName, bio:
                        profile?.bio
                }}
                onSubmit={values => {updateProfile(values).then(() => setEditMode(false))}}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='displayName' placeholder='Display Name' />
                        <MyTextArea name='bio' placeholder='' rows={3} />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated='right' positive type='submit' content='Update Profile' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
}
