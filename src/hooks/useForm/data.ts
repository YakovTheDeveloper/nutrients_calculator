import { object, string, ObjectSchema } from 'yup'

type Forms = 'login' | 'signup'

export const formSchemas: Record<Forms, ObjectSchema<any>> = {
    login: object({
        email: string().email().required(),
        password: string().required().max(40),
    }),
    signup: object({
        email: string().email().required(),
        password: string().min(6).max(20),
    }),
}

export const initialFormValues: Form.Items = {
    login: {
        email: '',
        password: '',
    },
    signup: {
        email: '',
        password: '',
    },
}
