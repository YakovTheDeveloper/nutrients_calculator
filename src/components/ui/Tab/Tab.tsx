import React, { ReactNode } from 'react';
import s from './Tab.module.scss';
import cn from 'classnames';
import { TabPanel } from '@ui/Tab/TabPanel/TabPanel';

export enum TabTypes {
    primary = 'primary',
    secondary = 'secondary',
}

type TabProps = {
    children: React.ReactNode;
    size?: 'medium' | 'big' | 'small';
    className?: string;
    active?: boolean;
    variant?: TabTypes;
} & React.ComponentPropsWithoutRef<'button'>;

const Tab = ({
    children,
    size = 'medium',
    className,
    active,
    variant = TabTypes.primary,
    ...rest
}: TabProps) => {
    return (
        <button
            {...rest}
            className={cn([
                className,
                active && s.tab_disabled,
                active && s.tab_active,
                s.tab,
                s[`tab_${variant}`],
                s[size],
            ])}
        >
            {children}
        </button>
    );
};
Tab.Panel = TabPanel;
export default Tab;
