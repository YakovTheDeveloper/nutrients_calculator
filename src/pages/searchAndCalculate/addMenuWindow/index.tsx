import AddMenuForm from '@forms/AddMenuForm'
import React from 'react'
import styles from './index.module.scss'

type IndexProps = {
    setShowAddNewMenuWindow: (value: React.SetStateAction<boolean>) => void
    showAddNewMenuWindow: boolean
}

const AddNewMenuWindow = ({
    setShowAddNewMenuWindow,
    showAddNewMenuWindow,
}: IndexProps) => {
    return (
        <div
            style={{
                position: 'absolute',
                zIndex: 10,
                top: '0',
                background: 'white',
            }}
        >
            {showAddNewMenuWindow && (
                <AddMenuForm
                    cornerButton={
                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: '1',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowAddNewMenuWindow(false)}
                        >
                            close
                        </button>
                    }
                />
            )}
        </div>
    )
}

export default AddNewMenuWindow
