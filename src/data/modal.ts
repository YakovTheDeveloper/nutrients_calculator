import { ModalsEnum } from '@constants/modal';
import { ReactNode } from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ModalState {
    id: ModalsEnum | null;
    modalContent: ReactNode
    openModal: (id: ModalsEnum) => void
    closeModal: () => void
    isOpened: boolean
    isPopoverOpened: boolean
    togglePopover: (open: boolean)=>void
}

export const useModalStore = create<ModalState>()(
    devtools(
        (set) => ({
            id: null,
            modalContent: null,
            isOpened: false,
            isPopoverOpened: false,
            openModal: (id) =>
                set((state) => ({
                    ...state,
                    id
                })),
            closeModal: () =>
                set((state) => {
                    return { ...state, isOpened: false, modalContent: null,id:null };
                }),
            togglePopover: (open: boolean) =>
                set((state) => {
                    return { ...state, isPopoverOpened: open};
                }),
        }),
        {
            name: 'modal-storage',
        }
    )
);
