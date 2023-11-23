import React from "react";
import SelectedProductsItem from "./SelectedProductsItem";
import s from "./SelectedProducts.module.scss";
import { SelectedProductsEnum, useSettings } from "@data/settings";
import cn from "classnames";
import { Tab, TabTypes } from "@ui";
import { isEmpty } from "@helpers/isEmpty";
import { ProductInfo } from "../../../components/modals/ProductInfo";
import { useModalStore } from "@data/modal";
// import { Tab, TabTypes } from "@ui";

type SelectedProductsProps = {
    products: Products.Selected2;
    onProductValueChange: (value: string, productId: string) => void;
    onProductDelete: (productId: number) => void;
    children?: React.ReactNode,
    showPanel?: boolean
};

const options = [
    { label: "Cards", value: SelectedProductsEnum.cards },
    { label: "List", value: SelectedProductsEnum.list }
];

const SelectedProducts = ({
                              products,
                              onProductValueChange,
                              onProductDelete,
                              children,
                              showPanel = true
                          }: SelectedProductsProps) => {
    const selectedProductsSettings = useSettings(
        (state) => state.selectedProductsSettings
    );
    const setSelectedProductsSettings = useSettings(
        (state) => state.setSelectedProductsSettings
    );
    const openModal = useModalStore(state => state.openModal);
    const modalContent = useModalStore(state => state.modalContent);

    console.log("selectedProductsSettings", selectedProductsSettings);
    // if (products)

    if (isEmpty(products)) return null;

    const isOpenedInModal = Boolean(modalContent);

    const onItemTitleClick = (product: Products.ItemWithNoNutrients) => {
        if (isOpenedInModal) return;
        openModal(
            <ProductInfo
                product={product}
            />);
    };

    return (
        <div className={s.selectedProducts}>
            <Tab.Panel className={s.selectedProducts__tabPanel} show={showPanel}>
                {options.map((opt) => (
                    <Tab variant={TabTypes.primary}
                         key={opt.value}
                         active={selectedProductsSettings.view === opt.value}
                         onClick={() => setSelectedProductsSettings(opt.value)}
                    >
                        {opt.label}
                    </Tab>
                ))}
            </Tab.Panel>
            <ul
                className={cn(
                    s.selectedProducts__list,
                    s[`selectedProducts__list_${selectedProductsSettings.view}`]
                )}
            >
                {Object.entries(products).map(([id, quantity]) => (
                    <SelectedProducts.Item
                        key={id}
                        id={id}
                        quantity={quantity}
                        onProductDelete={onProductDelete}
                        onProductValueChange={onProductValueChange}
                        onTitleClick={onItemTitleClick}
                        type={selectedProductsSettings.view}
                    />
                ))}
            </ul>
            {children}
        </div>
    );
};

SelectedProducts.Item = SelectedProductsItem;
export default SelectedProducts;
