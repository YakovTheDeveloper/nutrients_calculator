import { useUserStore } from "@data/user";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import {
    fetchMenuDelete,
    fetchPatchUserMenu,
    fetchProductListById
} from "@api/methods";
import SingleMenu from "./SingleMenu";
import { useProductStore } from "@data/products";
import { PatchMenuConfig } from "@data/user";
import { wait } from "@helpers/wait";
import SelectedProducts from "./SelectedProducts";
import Table from "@ui/Table";
import Nutrients from "@ui/Nutrients";
import { calculateTotalNutrients2 } from "@helpers/calculateTotalNutrients";
import { Button } from "@ui/Button";
import { ProductSearch } from "./ProductSearch";
import { Tab } from "@ui";

const Menu = () => {
    const {
        user,
        menus,
        removeMenu,
        // patchMenu,
        setMenus,
        initialMenuSnapshot,
        patchMenuProducts,
        updateMenu
    } = useUserStore(
        (state) => ({
            menus: state.menus,
            initialMenuSnapshot: state.initialMenuSnapshot,
            removeMenu: state.removeMenu,
            // patchMenu: state.patchMenu,
            patchMenuProducts: state.patchMenuProducts,
            user: state.user,
            setMenus: state.setMenus,
            updateMenu: state.updateMenu
        })
        // shallow
    );

    const { products } = useProductStore((state) => ({
        products: state.products
    }));

    const [currentMenuId, setCurrentMenuId] = useState(-1);

    const currentMenu = menus.find((menu) => menu.id === currentMenuId);
    const currentMenuOriginal = initialMenuSnapshot.find(
        (menu) => menu.id === currentMenuId
    );

    const onProductValueChange = (value: string, productId: number) =>
        patchMenuProducts({
            type: "modify",
            menuId: currentMenuId,
            productId,
            value
        });

    const onProductDelete = (productId: number) =>
        patchMenuProducts({
            type: "delete",
            menuId: currentMenuId,
            productId
        });

    const onProductAdd = (productId: number) =>
        patchMenuProducts({
            type: "add",
            menuId: currentMenuId,
            productId,
            value: 0
        });

    const { addProduct } = useProductStore((state) => ({
        addProduct: state.addProduct
    }));

    async function patchMenu() {
        if (!currentMenu) return;
        const { id, ...currentMenuData } = currentMenu;
        fetchPatchUserMenu(currentMenuId, currentMenuData);
        updateMenu(id, currentMenu);
    }

    useEffect(() => {
        const lol = menus.map((menu) => Object.keys(menu.products)).flat();
        const unique = Array.from(new Set(lol)).toString();
        //todo вычесть уже готовые id продуктов
        fetchProductListById({ food_id: unique }).then((items) =>
            addProduct(items.result)
        );
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
            <div className={styles.menu__content}>
                <div>
                    {currentMenu && (
                        <SelectedProducts
                            products={currentMenu.products}
                            onProductValueChange={onProductValueChange}
                            onProductDelete={onProductDelete}
                        />
                    )}
                    <div>
                        {wasChange && (
                            <Button onClick={patchMenu}>Сохранить</Button>
                        )}
                    </div>
                </div>
                {currentMenu && (
                    <Nutrients data={Object.values(totalNutrients)} />
                )}
            </div>
        </div>
    );
};

export default Menu;
