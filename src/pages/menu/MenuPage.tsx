import { useUserStore } from '@data/user';
import React, { useEffect, useState } from 'react';
import styles from './MenuPage.module.scss';
import { fetchPatchUserMenu, fetchProductListById } from '@api/methods';
import { useProductStore } from '@data/products';
import SelectedProducts from './SelectedProducts';
import Nutrients from '@ui/Nutrients/Nutrients';
import { calculateTotalNutrients2 } from '@helpers/calculateTotalNutrients';
import { Button } from '@ui/Button';
import { ProductSearch } from './ProductSearch';
import { Tab, TabTypes } from '@ui';
import SplitSection from '@layout/SplitSection';

const MenuPage = () => {
    const {
        user,
        menus,
        removeMenu,
        // patchMenu,
        setMenus,
        initialMenuSnapshot,
        patchMenuProducts,
        updateMenu,
        currentMenuId,
        setCurrentMenuId,
    } = useUserStore(
        (state) => ({
            menus: state.menus,
            currentMenuId: state.currentMenuId,
            initialMenuSnapshot: state.initialMenuSnapshot,
            removeMenu: state.removeMenu,
            // patchMenu: state.patchMenu,
            patchMenuProducts: state.patchMenuProducts,
            user: state.user,
            setMenus: state.setMenus,
            updateMenu: state.updateMenu,
            setCurrentMenuId: state.setCurrentMenuId,
        })
        // shallow
    );

    const { products } = useProductStore((state) => ({
        products: state.products,
    }));

    const fetchSelectedProductsFullData = useProductStore(
        (s) => s.fetchSelectedProductsFullData
    );

    const currentMenu = menus.find((menu) => menu.id === currentMenuId);
    const currentMenuOriginal = initialMenuSnapshot.find(
        (menu) => menu.id === currentMenuId
    );

    const onProductValueChange = (value: string, productId: number) =>
        patchMenuProducts({
            type: 'modify',
            menuId: currentMenuId,
            productId,
            value,
        });

    const onProductDelete = (productId: number) =>
        patchMenuProducts({
            type: 'delete',
            menuId: currentMenuId,
            productId,
        });

    const onProductAdd = (productId: number) =>
        patchMenuProducts({
            type: 'add',
            menuId: currentMenuId,
            productId,
            value: 0,
        });

    // const { addProduct } = useProductStore((state) => ({
    //     addProduct: state.addProduct,
    // }));

    async function patchMenu() {
        if (!currentMenu) return;
        const { id, ...currentMenuData } = currentMenu;
        fetchPatchUserMenu(currentMenuId, currentMenuData);
        updateMenu(id, currentMenu);
    }

    useEffect(() => {
        if (!currentMenu) return;
        fetchSelectedProductsFullData(currentMenu?.products);
    }, [menus]);

    const wasChange =
        Object.keys(currentMenu?.products || {}).length !==
            Object.keys(currentMenuOriginal?.products || {}).length ||
        JSON.stringify(currentMenu?.products) !==
            JSON.stringify(currentMenuOriginal?.products);

    const idToQuantity = currentMenu?.products || {};

    const totalNutrients = calculateTotalNutrients2(products, idToQuantity);

    return (
        <div className={styles.menu}>
            <header>
                {currentMenu && (
                    <ProductSearch
                        onProductAdd={onProductAdd}
                        selectedProducts={currentMenu?.products || {}}
                    />
                )}
                <Tab.Panel>
                    {menus.map((menu) => (
                        <Tab
                            variant={TabTypes.primary}
                            active={menu.id === currentMenuId}
                            key={menu.id}
                            onClick={() => setCurrentMenuId(menu.id)}
                        >
                            {menu.name}
                        </Tab>
                    ))}
                </Tab.Panel>
            </header>
            {!user && <h2>Log in to see or create your menus</h2>}
            <SplitSection>
                {currentMenu && (
                    <SelectedProducts
                        products={currentMenu.products}
                        onProductValueChange={onProductValueChange}
                        onProductDelete={onProductDelete}
                    >
                        <div>
                            {wasChange && (
                                <Button onClick={patchMenu}>Сохранить</Button>
                            )}
                        </div>
                    </SelectedProducts>
                )}
                {currentMenu && (
                    <Nutrients data={Object.values(totalNutrients)} />
                )}
            </SplitSection>
        </div>
    );
};

export default MenuPage;
