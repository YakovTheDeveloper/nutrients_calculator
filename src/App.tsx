import React from 'react'
import Button from '@ui/Button'
import Table from '@ui/Table'
import Search from '@ui/Search'
import SearchAndCalculate from '@pages/searchAndCalculate'
import './styles/index.scss'

//todo path like @forms
import AuthForm from './components/forms/SignupForm'
import SignupForm from './components/forms/SignupForm'
import LoginForm from '@forms/LoginForm'

export const App = () => {
    return (
        <div>
            <SignupForm />
            <LoginForm />
            <SearchAndCalculate />
            {/* <Table /> */}
        </div>
    )
}
