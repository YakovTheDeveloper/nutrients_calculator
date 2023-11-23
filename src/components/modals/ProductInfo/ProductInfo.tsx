import React, { useEffect } from "react";
import { useProductStore } from "@data/products";
import { Button, ButtonTypes } from "@ui/Button";

import s from "./ProductInfo.module.scss";
import { calculateTotalNutrients2 } from "@helpers/calculateTotalNutrients";
import { useUserStore } from "@data/user";
import Nutrients from "@ui/Nutrients/Nutrients";
import SelectedProducts from "@pages/menu/SelectedProducts";
import { useImmer } from "use-immer";
import ButtonToggleAddProduct from "@ui/Button/ButtonToggleAddProduct/ButtonToggleAddProduct";

type ProductInfoProps = {
    product: Products.ItemWithNoNutrients
    onOpen?: () => Promise<Products.IdToItemMapping | null>
}

const INITIAL_PRODUCT_AMOUNT = 100

const ProductInfo = ({ product, onOpen }: ProductInfoProps) => {
    const { products } = useProductStore((state) => ({
        products: state.products
    }));

    const fetchSelectedProductsFullData = useProductStore(s => s.fetchSelectedProductsFullData);

    const [selectedProduct, setSelectedProduct] = useImmer({
        [product.id]: INITIAL_PRODUCT_AMOUNT
    });

    const onProductValueChange = (value: string) =>
        setSelectedProduct(draft => {
            draft[product.id] = +value;
        });

    const totalNutrients = calculateTotalNutrients2(products, selectedProduct);

    useEffect(() => {
        onOpen?.();

        fetchSelectedProductsFullData({
            [product.id]: 100
        });

    }, []);

    return (
        <div className={s.productInfo}>
            <div className={s.productInfo__product}>
                <SelectedProducts
                    showPanel={false}
                    products={selectedProduct}
                    onProductValueChange={onProductValueChange}
                    onProductDelete={() => {
                    }}
                />
                <div
                    className={s.productInfo__addButton}
                >
                    <Button.ToggleAddProduct productId={product.id} />
                </div>
            </div>
            <Nutrients data={Object.values(totalNutrients)} />
        </div>
    );
};

export default ProductInfo;
