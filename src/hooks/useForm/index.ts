import { useUser } from '@data/user'
import { useEffect } from 'react'
import { debounce } from '@helpers/debounce'
import { useState } from 'react'
import { ValidationError } from 'yup'
import { formSchemas, initialFormValues } from './data'

const useForm = (
    form: Form.Names,
    submitCallback: (payload: Form.Types) => Promise<Api.Result>
) => {
    const initialFormValue = initialFormValues[form]
    const [formData, setFormData] = useState<Form.Types>(initialFormValue)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showErrors, setShowErrors] = useState(false)
    const [success, setSuccess] = useState(false)
    const { setUser } = useUser()

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowErrors(false)
        setSuccess(false)
        const field = e.target.name
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

    // const showErrorsDelayed = debounce(() => setShowErrors(true), 2000)
    // const setErrorsDelayed = debounce(setErrors, 1000)

    const validateField = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        try {
            if (!inputValue) return // prevent validation on untouched fields
            const currentSchema = formSchemas[form]
            const inputValidated = currentSchema.validateSyncAt(inputName, {
                [inputName]: inputValue,
            })
            if (inputValidated)
                setErrors((prev) => ({ ...prev, [inputName]: '' }))
        } catch (err) {
            setShowErrors(true)
            const validationError = err as ValidationError
            setErrors((prev) => ({
                ...prev,
                [inputName]: validationError.message,
            }))
        }
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (success) timeout = setTimeout(() => setSuccess(false), 2500)
        return () => clearTimeout(timeout)
    }, [success])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const atLeastOneError = Object.values(errors).some((key) => key !== '')
        if (atLeastOneError) return

        submitCallback(formData).then((data) => {
            if (data.isError) {
                setShowErrors(true)
                setErrors((prev) => ({
                    ...prev,
                    responseError: data.reason,
                }))
                return
            }
            setUser({
                data: {
                    email: data.result?.email,
                },
            })

            setFormData(initialFormValue)
            setSuccess(true)
        })
    }

    return {
        onChange,
        validateField,
        errors,
        success,
        formData,
        onSubmit,
        showErrors,
    }
}

export default useForm
