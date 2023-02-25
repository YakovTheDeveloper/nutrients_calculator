import { object, string, ObjectSchema } from 'yup'

export const formSchemas: Record<Form.Names, ObjectSchema<any>> = {
    login: object({
        email: string().email().required(),
        password: string().required().max(40),
    }),
    signup: object({
        email: string().email().required(),
        password: string().min(6).max(20),
    }),
    addMenu: object({
        name: string().required().min(1).max(50).trim(),
        description: string().min(1).max(150).trim(),
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
    addMenu: {
        name: '',
        description: '',
    },
}

const x = object({
    email: string().email().required(),
    password: string().required().max(40),
})