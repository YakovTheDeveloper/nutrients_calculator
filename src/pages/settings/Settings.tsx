import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import s from './Settings.module.scss';
import React from 'react';
import { useBaseProducts } from '@data/product/useBaseProducts';
import Table from '@ui/Nutrients2/Table';
import { colorFoodHighlight } from '@constants/colors';
import { fetchDeleteProduct } from '@api/methods';
import { Button, ButtonTypes } from '@ui/Button';
import { useModalStore } from '@data/modal';
import ProductInfo from '../../components/modals/ProductInfo/ProductInfo';

const NUTRIENT_NORMS_LINK = 'norms';

const Settings = () => {
    return (
        <div>
            <NavLink
                to={`/${NUTRIENT_NORMS_LINK}`}
                className={({ isActive }) =>
                    isActive ? classNames(s.link, s.active) : classNames(s.link)
                }
            >
                Change nutrient norms
            </NavLink>
        </div>
    );
};
export default Settings;
