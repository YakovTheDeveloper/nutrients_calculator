import { ReactNode } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ModalState {
    modalContent: ReactNode
    openModal: (content: ReactNode) => void
    closeModal: () => void
    isOpened: boolean
}

export const useModalStore = create<ModalState>()(
    devtools(
        (set) => ({
            modalContent: null,
            isOpened: false,
            openModal: (content) =>
                set((state) => ({
                    ...state,
                    isOpened: true,
                    modalContent: content,
                })),
            closeModal: () =>
                set((state) => {
                    return { ...state, isOpened: false, modalContent: null }
                }),
        }),
        {
            name: 'modal-storage',
        }
    )
)
