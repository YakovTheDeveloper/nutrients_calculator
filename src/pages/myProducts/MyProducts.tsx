import { NavLink } from "react-router-dom";
import classNames from "classnames";
import s from "./MyProducts.module.scss";
import React from "react";
import { useBaseProducts } from "@data/product/useBaseProducts";
import Table from "@ui/Nutrients2/Table";
import { colorFoodHighlight } from "@constants/colors";
import { fetchDeleteProduct } from "@api/methods";
import { Button, ButtonTypes } from "@ui/Button";
import { useModalStore } from "@data/modal";
import ProductInfo from "../../components/modals/ProductInfo/ProductInfo";


const CREATE_PRODUCTS_LINK = "create_product";

const MyProducts = () => {

        const userProductsMinimal = useBaseProducts(s => s.userProductsMinimal),
            getUserProductsMinimal = useBaseProducts(s => s.getUserProductsMinimal),
            deleteFromUserProductsMinimal = useBaseProducts(s => s.deleteFromUserProductsMinimal),
            openModal = useModalStore(s => s.openModal);

        const deleteProduct = async (id: number) => {
            deleteFromUserProductsMinimal(id);
            try {
                const data = await fetchDeleteProduct(id);
                if (data.result) deleteFromUserProductsMinimal(id);
            } catch (e) {
                console.error(e);
            }
        };

        const render = {
            name: (product) => (
                <span onClick={() => openModal(<ProductInfo product={product} />)}>
                    {product.name}
                </span>
            ),
            actions: ({ id }) => (
                <Button
                    variant={ButtonTypes.ghost}
                    danger
                    onClick={() => deleteProduct(id)}
                    className={s.myProducts__deleteButton}>
                    Delete
                </Button>
            )
        };

        const data = getUserProductsMinimal("array");
        return (
            <div>
                <NavLink
                    to={`/${CREATE_PRODUCTS_LINK}`}
                    className={({ isActive }) =>
                        isActive
                            ? classNames(s.link, s.active)
                            : classNames(s.link)
                    }
                >
                    Create product
                </NavLink>
                <Table
                    heading="My products"
                    data={data}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "actions", label: "" }
                    ]}
                    highlight={{
                        color: colorFoodHighlight
                    }}
                    render={render}
                />
            </div>
        );
    }
;

export default MyProducts;
;
;