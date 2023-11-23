import { EMOJI } from '@constants/misc'
import {Button} from '@ui/Button'
import cn from 'classnames'
import React from 'react'
import { MenuAction } from '../useMenuControls'
import styles from './index.module.scss'

type EditableTextProps = {
    children: React.ReactNode
    onTextEdit: (text: string) => void
    toggleEditMode: () => void
    editMode: boolean
    undo: () => void
    value: string
    initValue: string
    makeChange: () => Promise<void>
    editIcon?: string
    wrapperClassName?: string
    maxLength?: number
}

const EditableText = ({
    onTextEdit,
    toggleEditMode,
    editMode,
    children,
    undo,
    value = '',
    initValue,
    makeChange,
    wrapperClassName,
    editIcon = EMOJI.gear,
    maxLength = 50,
}: EditableTextProps) => {
    console.log('@@', value)
    console.log('@@', initValue)
    return editMode ? (
        <div className={cn(styles.container, wrapperClassName)}>
            <button onClick={undo}>{EMOJI.cross}</button>
            <input
                onKeyDown={(e) => e.key === 'Enter' && makeChange()}
                className={styles.input}
                style={{ minWidth: '200px' }}
                type="text"
                onChange={(e) => onTextEdit(e.target.value)}
                value={value}
                maxLength={maxLength}
            />
            {value.length > 0 && initValue !== value && (
                <Button onClick={makeChange} bordered size="small">
                    🔥
                </Button>
            )}
        </div>
    ) : (
        <div className={cn(styles.container, wrapperClassName)}>
            {children}
            <Button onClick={toggleEditMode} className={styles.editButton}>
                {editIcon}
            </Button>
        </div>
    )
}

export default EditableText
