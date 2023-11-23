import React from 'react';
import s from './ModalPage.module.scss';
import { ModalsEnum } from '@constants/modal';
import { useModalStore } from '@data/modal';

type ModalPageProps = {
    children: React.ReactNode
    id: ModalsEnum
}
const ModalPage = ({children,id}:ModalPageProps) => {
	const {currentId,close} = useModalStore(s => ({
		currentId:s.id,
		close:s.closeModal
	}));

	if(currentId !== id) return null;
    
	return (
		<div className={s.modal}>
			<div className={s.modalContainer}>
				<button
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						padding: '10px',
						zIndex: '1',
						cursor: 'pointer'
					}}
					onClick={close}
				>
                                            x
				</button>
				<div className={s.modalInner}>{children}</div>
			</div>
			<div className={s.modalOverlay} onClick={close}></div>
		</div>
	);
};

export default ModalPage;


