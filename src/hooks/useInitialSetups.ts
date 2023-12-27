import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { getToken } from '@api/localStorage';
import { fetchGetNorms, fetchGetUserProducts, fetchMe, fetchUserMenus } from '@api/methods';
import { useNutrientNormsStore } from '@data/normsStore';
import { useBaseProducts } from '@data/product/useBaseProducts';
import { useSettings } from '@data/settings';
import { useUserStore } from '@data/user';

export function useInitialSetups() {
	const { user, setUser, setMenus, clearStore, setCurrentMenuId } = useUserStore(
			(state) => ({
				user: state.user,
				setUser: state.setUser,
				setMenus: state.setMenus,
				setCurrentMenuId: state.setCurrentMenuId,
				clearStore: state.clearStore,
				setCalcNutrientNorms: state.setCalcNutrientNorms,
			}),
			shallow,
		),
		setCalcNutrientNorms = useSettings((s) => s.setCalcNutrientNorms),
		addNutrientNorm = useNutrientNormsStore((s) => s.addNutrientNorm),
		{ setUserProductsMinimal } = useBaseProducts(),
		fetchMeHandler = async () => {
			try {
				const response = await fetchMe();
				const userData = response.result;
				setUser({
					data: {
						email: userData.email,
					},
				});
			} catch (error) {
				console.error(error);
			}
		},
		getMenuHandler = async () => {
			try {
				const response = await fetchUserMenus();
				const menus = response.result;
				console.log('response result', menus);
				// const categories = groupNutrientsByCategory(menu.nutrients)
				setMenus(menus);
				menus[0] && setCurrentMenuId(menus[0].id);
			} catch (error) {
				console.error(error);
			}
		},
		getUserProductsHandler = async () => {
			try {
				const response = await fetchGetUserProducts();

				return response.result;
			} catch (error) {
				console.error(error);

				return null;
			}
		},
		getNormsHandler = async (): Promise<Norm.Api.Get | null> => {
			try {
				const response = await fetchGetNorms();

				return response.result;
			} catch (error) {
				console.error(error);

				return null;
			}
		};

	// useEffect(() => {
	//     result && addNutrientNorm(result);
	// }, [result]);

	// console.log('@isLoading',isLoading,error,result);

	useEffect(() => {
		if (user) {
			getMenuHandler();
			getUserProductsHandler().then((res) => res && setUserProductsMinimal(res));

			// fetchGetNorms().then(res => res && addNutrientNorm(res.result));

			// .then((res) => res && setCalcNutrientNorms(res));
			return;
		}

		if (!getToken()) {
			return;
		}

		fetchMeHandler();
	}, [user]);
}
