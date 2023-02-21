import { useEffect } from 'react'
import { debounce } from '@helpers/debounce'
import { useState } from 'react'
import { object, string, ObjectSchema, ValidationError } from 'yup'

type Forms = 'login' | 'signup'
const formSchemas: Record<Forms, ObjectSchema<any>> = {
    login: object({
        email: string().email().required(),
        password: string().required().max(40),
    }),
    signup: object({
        email: string().email().required(),
        password: string().min(6).max(20),
    }),
}

const initialFormValues: Form.Items = {
    login: {
        email: '',
        password: '',
    },
    signup: {
        email: '',
        password: '',
    },
}

export const useForm = (
    form: Forms,
    submitCallback: (payload: Form.Types) => Promise<Api.Result>
) => {
    const initialFormValue = initialFormValues[form]
    const [formData, setFormData] = useState<Form.Types>(initialFormValue)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showErrors, setShowErrors] = useState(false)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowErrors(false)
        const field = e.target.name
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

    useEffect(() => {
        console.log('errors', errors)
        // if (errors.length === 0) {
        //     setShowErrors(false)
        //     return
        // }
        // const showErrorTimer = setTimeout(() => setShowErrors(true), 1500)

        // return () => clearTimeout(showErrorTimer)
    }, [errors, formData])

    // const showErrorsDelayed = debounce(() => setShowErrors(true), 2000)
    // const setErrorsDelayed = debounce(setErrors, 1000)

    const validateField = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        try {
            if (!inputValue) return // prevent validation on untouched fields
            const currentSchema = formSchemas[form]
            const validated = currentSchema.validateSyncAt(inputName, {
                [inputName]: inputValue,
            })
            if (validated)
                setErrors((prev) => ({
                    ...prev,
                    [inputName]: '',
                }))
        } catch (err: any) {
            setShowErrors(true)
            const validationError = err as ValidationError
            console.log(validationError.path)
            console.log(validationError.message)
            // const inputName = validationError.path

            setErrors((prev) => ({
                ...prev,
                [inputName]: validationError.message,
            }))
            // setErrors(validationError.errors)
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const atLeastOneError = Object.values(errors).some((key) => key !== '')
        if (atLeastOneError) return

        submitCallback(formData).then((data) => {
            console.log('to send', formData)
            if (data.isError) {
                setShowErrors(true)
                setErrors((prev) => ({
                    ...prev,
                    responseError: data.reason,
                }))
                return
            }
            setFormData(initialFormValue)
        })
    }

    return {
        onChange,
        validateField,
        errors,
        formData,
        onSubmit,
        showErrors,
    }
}
