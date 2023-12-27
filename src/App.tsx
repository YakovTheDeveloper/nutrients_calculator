import React, { useEffect } from 'react';

import './styles/index.scss';
import useSWR, { SWRConfig } from 'swr';

import { fetchGetNorms } from '@api/methods';
import { useNutrientNormsStore } from '@data/normsStore';
import { useInitialSetups } from '@hooks/useInitialSetups';
import Layout from '@layout/Layout/Layout';

import { ModalRoot } from './components/modals/ModalRoot';

export const App = () => {
	// const { isOpened, closeModal, modalContent } = useModalStore()
	// const userData = useUserStore((state) => state.user?.data)
	const addNutrientNorm = useNutrientNormsStore((s) => s.addNutrientNorm);

	const { data: result } = useSWR('/norms', fetchGetNorms);

	useInitialSetups();

	useEffect(() => {
		if (!result) {
			return;
		}
		addNutrientNorm(result.result);
	}, [result]);
	// useEffect(() => {
	//     if (!userData) return
	//     closeModal()
	// }, [userData])

	return (
		<>
			<SWRConfig value={{ provider: () => new Map() }}>
				{/* {isOpened && <Modal onClose={closeModal}>{modalContent}</Modal>} */}
				<Layout />
				<ModalRoot />
			</SWRConfig>
		</>
	);
};
