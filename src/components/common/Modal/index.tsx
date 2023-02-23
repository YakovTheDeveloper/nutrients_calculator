import React, { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

const portalRoot = document.getElementById('portal-root')

const hideScrollbar = () =>
    document.getElementsByTagName('body')[0].classList.add('modal-open')
const showScrollbar = () =>
    document.getElementsByTagName('body')[0].classList.add('modal-open')

type ModalProps = {
    children: ReactNode
    onClose: () => void
}

const Modal = ({ children, onClose }: ModalProps) => {
    const container = document.createElement('div')
    useEffect(() => {
        portalRoot?.appendChild(container)
        hideScrollbar()
        return () => {
            portalRoot?.removeChild(container)
            showScrollbar()
        }
    })
    const child = (
        <>
            <div className={styles.modalContainer}>{children}</div>
            <div className={styles.overlay} onClick={onClose}></div>
        </>
    )
    return createPortal(child, container)
}

export default Modal
