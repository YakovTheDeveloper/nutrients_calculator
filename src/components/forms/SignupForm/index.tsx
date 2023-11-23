import { Button } from '@ui/Button';
import ClearButton from '@ui/Button/ClearButton';
import Input from '@ui/Input/Input';
import React from 'react';
// import Form from '@forms/Form';
// import Input from '@ui/Input/Input';
// import styles from './index.module.scss';
// import { useUserStore } from '@data/user';
// import { fetchSignup } from '@api/methods';
// import { setToken } from '@api/localStorage';
// import ClearButton from '@ui/Button/ClearButton';

import { useForm } from 'react-hook-form';

const SignupForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    console.log('errors',errors);

    return (
        <form onSubmit={handleSubmit((data) => console.log(data))}>
            {/* <input {...register('firstName')} /> */}

            <Input
                {...register('email', { required: true })}
                placeholder='mail@example.com'
                label="Email"
                type="email"
                required
                size="medium"
                aria-label="email-input"
                onClear={() => {
                    setValue('email', '');
                }}
            />
            {errors.email && <p> is required.</p>}

            <Input
                {...register('password', { required: true, minLength: 5 })}
                placeholder='goodcat642'
                label="Password"
                type="text"
                required
                size="medium"
                aria-label="password-input"
                onClear={() => {
                    setValue('password', '');
                }}
            />
            {errors.password && <p>Last name is required.</p>}

            <Button type='submit'>
                Okay
            </Button>
        </form>
    );
};

export default SignupForm;
// import React from 'react'
// import Form from '@forms/Form'
// import useForm from '@hooks/useForm'
// import Input from '@ui/Input/Input'
// import styles from './index.module.scss'
// import { useUserStore } from '@data/user'
// import { fetchSignup } from '@api/methods'
// import { setToken } from '@api/localStorage'
// import ClearButton from '@ui/Button/ClearButton'

// const inputNames: Form.InputNames<Form.SignupForm> = {
//     email: 'email',
//     password: 'password',
// }

// const init: Form.SignupForm = {
//     email: '',
//     password: '',
// }

// const SignupForm = () => {
//     const { setUser } = useUserStore()

//     const signUpHandler = async (payload: Form.SignupForm) => {
//         const response = await fetchSignup(payload)
//         setToken(response.result.token)
//         setUser({ data: response.result })
//     }

//     const {
//         errors,
//         formData,
//         validateField,
//         onChange,
//         onSubmit,
//         showErrors,
//         success,
//     } = useForm<Form.SignupForm>('signup', signUpHandler, init)
//     return (
//         <Form
//             errors={errors}
//             heading="Sign up"
//             onSubmit={onSubmit}
//             showErrors={showErrors}
//             success={success}
//         >
//             <Input
//                 label="Email"
//                 name={inputNames.email}
//                 type="email"
//                 required
//                 onChange={onChange}
//                 onBlur={validateField}
//                 value={formData['email']}
//                 size="medium"
//                 aria-label="email-input"
//             >
//                 <ClearButton
//                     show={true}
//                     onClick={() => {
//                         setFormData((prev) => ({ ...prev, email: '' }))
//                     }}
//                 ></ClearButton>
//             </Input>

//             <Input
//                 label="Password"
//                 name={inputNames.password}
//                 type="password"
//                 required
//                 onChange={onChange}
//                 onBlur={validateField}
//                 value={formData['password']}
//                 aria-label="email-password"
//                 size="medium"
//             >
//                 <ClearButton
//                     show={true}
//                     onClick={() =>
//                         setFormData((prev) => ({ ...prev, password: '' }))
//                     }
//                 ></ClearButton>
//             </Input>
//         </Form>
//     )
// }

// export default SignupForm
