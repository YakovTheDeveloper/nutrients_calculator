import { Button, ButtonProps, ButtonTypes } from '@ui/Button';
import React from 'react';
import { useUserStore } from '@data/user';

type ButtonToggleAddProduct = {
    productId: number
    toggleBetween?: { add: ButtonTypes, added: ButtonTypes }
} & ButtonProps

const ButtonToggleAddProduct = ({ productId, toggleBetween, ...rest }: ButtonToggleAddProduct) => {

    const { isProductInMainMenu, patchMainPageMenuProducts, mainPageMenu } = useUserStore((state) => ({
        isProductInMainMenu: state.isProductInMainMenu,
        patchMainPageMenuProducts: state.patchMainPageMenuProducts,
        mainPageMenu: state.mainPageMenu
    }));


    const onProductAdd = (productId: number) =>
        patchMainPageMenuProducts({
            type: 'add',
            productId,
            value: 0
        });

    const onProductDelete = (productId: number) =>
        patchMainPageMenuProducts({
            type: 'delete',
            productId
        });

    const buttonHandler = () => isProductInMainMenu(productId)
        ? onProductDelete(productId)
        : onProductAdd(productId);

    const getHint = () => isProductInMainMenu(productId)
        ? 'Remove from main menu'
        : 'Add to main menu';

    return (
        <Button
            {...rest}
            title={getHint()}
            onClick={buttonHandler}
            variant={isProductInMainMenu(productId)
                ? toggleBetween?.added || ButtonTypes.tertiary
                : toggleBetween?.add || ButtonTypes.ghost}

            // variant={isProductInMainMenu(productId)
            //     ? toggleBetween?.added || ButtonTypes.success
            //     : toggleBetween?.add || ButtonTypes.primary}
        >
            {isProductInMainMenu(productId) ? 'Added' : 'Add'}
            {/*{isProductInMainMenu(productId) ? "Added" : "Add"}*/}
        </Button>
    );
};

export default ButtonToggleAddProduct;