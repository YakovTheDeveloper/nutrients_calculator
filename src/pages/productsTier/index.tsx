import React, { useEffect, useMemo, useState } from "react";
import { fetchNutrients, fetchProductsByNutrient } from "@api/methods";
import { useProductStore } from "@data/products";
import { Button, ButtonTypes } from "@ui/Button";

import s from "./index.module.scss";
import { getNutrientsByGroups, useNutrientsStore } from "@data/nutrients";
import { objectEntries } from "@helpers/objectEntries";
import { useNutrientNavigation } from "@pages/common/useNutrientNavigation";
import Table from "@ui/Nutrients2/Table";
import { useModalStore } from "@data/modal";
import { ProductInfo } from "../../components/modals/ProductInfo";
import classNames from "classnames";
import { colorFoodHighlight } from "@constants/colors";

const columns = [{
    key: "name",
    label: "Name"
}];

const ProductsTier = () => {
    // fetchProductsByNutrient({ id: 'copper' })

    const {
            allDefaultNutrientsFromNorm,
            setAllDefaultNutrientsFromNorm,
            hasDefaultNutrientsFromNorm
        } = useNutrientsStore(),
        { scrollRefs, containerRef, navigate } = useNutrientNavigation();

    useEffect(() => {
        if (hasDefaultNutrientsFromNorm()) return;
        fetchNutrients({ have_norms: true })
            .then((data) => {

                if (!data.result) return;
                setAllDefaultNutrientsFromNorm(data.result);
            });
    }, []);


    const {
        selectedProducts,
        fetchSelectedProductsFullData,
        addProductToSelected,
        productsTier,
        fetchAndAddTierProducts
    } = useProductStore((state) => ({
        fetchSelectedProductsFullData: state.fetchSelectedProductsFullData,
        selectedProducts: state.selectedProducts,
        addProductToSelected: state.addProductToSelected,
        productsTier: state.productsTier,
        fetchAndAddTierProducts: state.fetchAndAddTierProducts
    }));

    const [currentNutrient, setCurrentNutrient] =
        useState<{
            id: number,
            name: string
        } | null>(null);

    const [products, setProducts] =
        useState<Products.ItemSelected[]>([]);

    //todo как-то кешировать одинаковые запросы
    useEffect(() => {
        if (currentNutrient == null) return;
        fetchProductsByNutrient({ nutrient_id: currentNutrient.id })
            .then(data => data.result && setProducts(data.result));
    }, [currentNutrient]);


    const groups = useMemo(() => getNutrientsByGroups(allDefaultNutrientsFromNorm), [allDefaultNutrientsFromNorm]);
    const render = {
        name: ({ id, name }) => (
            <div
                className={classNames(
                    s.productTiers__nutrient,
                    id === currentNutrient?.id && s.productTiers__nutrient_active
                )}
                onClick={() => setCurrentNutrient({
                    id,
                    name
                })}>
                {name}
            </div>
        )
    };

    const openModal = useModalStore(state => state.openModal);
    const onItemClick = (product: Products.ItemWithNoNutrients) => openModal(
        <ProductInfo
            product={product}
        />);

    const productsHeading = (
        <>
            Products {currentNutrient && <span>
                {currentNutrient?.name}
            </span>}
        </>
    );

    return (
        <div className={s.productTiers}>

            <div ref={containerRef}>
                {objectEntries(groups).map(([key, group], index) => {
                    // if (!showGroups[key]) return null;
                    return (
                        <Table
                            ref={scrollRefs[index]}
                            key={key}
                            data={group.content}
                            heading={group.name}
                            columns={columns}
                            render={render}
                            emptyPlaceholder={"N/A"}
                            showHeader={false}
                            highlight={{
                                show: false
                            }}
                        />
                    );
                })}
            </div>
            <div>
                <Table
                    data={products}
                    heading={productsHeading}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "description", label: "Description" },
                        { key: "quantity", label: "Amount" },
                        { key: "action", label: "" }
                    ]}
                    render={{
                        action: (data) => <Button.ToggleAddProduct productId={data.id} toggleBetween={{
                            add: ButtonTypes.success,
                            added: ButtonTypes.tertiary
                        }} />,
                        name: (data) => <div className={s.productTiers__product} onClick={() => onItemClick(data)}>{data.name}</div>
                    }}
                    emptyPlaceholder={"N/A"}
                    highlight={{
                        color: colorFoodHighlight
                    }}
                />
            </div>
        </div>
    );
};

export default ProductsTier;
