import React, { useEffect, useId, useState } from 'react';
import { useProductStore } from '@data/products';
import { Button, ButtonSizes, ButtonTypes } from '@ui/Button';

import styles from './index.module.scss';
import { calculateTotalNutrients2 } from '@helpers/calculateTotalNutrients';
import classNames from 'classnames';
import { useUserStore } from '@data/user';
import AddNewMenuWindow from './addMenuWindow';
import Nutrients from '@ui/Nutrients/Nutrients';
import { ProductSearch } from '@pages/menu/ProductSearch';
import SelectedProducts from '@pages/menu/SelectedProducts';
import SplitSection from '@layout/SplitSection';
import AddMenuForm from '@forms/AddMenuForm';
import { Popover } from '@ui/Popover';

const SearchAndCalculate = () => {
    const {
        clearTotalNutrients,
        products,
        fetchSelectedProductsFullData,
    } = useProductStore((state) => ({
        clearTotalNutrients: state.clearTotalNutrients,
        products: state.products,
        fetchSelectedProductsFullData: state.fetchSelectedProductsFullData,
    }));

    const userData = useUserStore((state) => state.user?.data);
    const clearMainPageMenu = useUserStore((state) => state.clearMainPageMenu);

    const { menus, patchMainPageMenuProducts, mainPageMenu } = useUserStore(
        (state) => ({
            menus: state.menus,
            patchMenuProducts: state.patchMenuProducts,
            patchMainPageMenuProducts: state.patchMainPageMenuProducts,
            mainPageMenu: state.mainPageMenu
        })
        // shallow
    );

    const [showAddNewMenuWindow, setShowAddNewMenuWindow] = useState(false);

    const productsCount = Object.keys(mainPageMenu.products).length;

    useEffect(() => {
        fetchSelectedProductsFullData(mainPageMenu.products);
    }, [productsCount]);

    const clearDataHandler = () => {
        clearMainPageMenu(),
        clearTotalNutrients();
    };

    const onProductAdd = (productId: number) =>
        patchMainPageMenuProducts({
            type: 'add',
            productId,
            value: 0
        });
    const onProductValueChange = (value: string, productId: string) =>
        patchMainPageMenuProducts({
            type: 'modify',
            productId,
            value
        });

    const onProductDelete = (productId: number) =>
        patchMainPageMenuProducts({
            type: 'delete',
            productId
        });


    useEffect(() => {
        setShowAddNewMenuWindow(false);
    }, [menus]);


    const isAnyProductSelected = Object.keys(mainPageMenu.products).length > 0;

    const idToQuantity = mainPageMenu?.products || {};

    const totalNutrients = calculateTotalNutrients2(products, idToQuantity);
    console.log('Object.values(totalNutrients)', Object.values(totalNutrients));
    return (
        <div className={styles.searchAndCalculate}>
            <div className={styles.searchAndCalculate__searchBarContainer}>
                <ProductSearch
                    onProductAdd={onProductAdd}
                    selectedProducts={mainPageMenu.products}
                />
            </div>

            <SplitSection>
                <SelectedProducts
                    products={mainPageMenu.products}
                    onProductValueChange={onProductValueChange}
                    onProductDelete={onProductDelete}
                >
                    <div className={styles.searchAndCalculate__actions}>
                        {isAnyProductSelected ? (
                            <Button
                                onClick={clearDataHandler}
                                size={ButtonSizes.small}
                                variant={ButtonTypes.secondary}
                            >
                                Clear menu
                            </Button>
                        ) : null}

                        <AddNewMenuWindow
                            setShowAddNewMenuWindow={setShowAddNewMenuWindow}
                            showAddNewMenuWindow={showAddNewMenuWindow}
                        />

                        {userData && isAnyProductSelected ? (
                            <Popover 
                                clickElement={
                                    <Button>
                                        Save
                                    </Button>
                                }
                                contentElement={<AddMenuForm/>}
                            />

   
                        ) : null}
                    </div>
                </SelectedProducts>
                <Nutrients data={Object.values(totalNutrients)} />
            </SplitSection>

            <div className={classNames(styles.loader, styles.no)}></div>

        </div>
    );
};

export default SearchAndCalculate;
