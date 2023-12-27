import cn from 'classnames';
import React, { ReactNode } from 'react';

import { ButtonToggleAddProduct } from '@ui/Button/ButtonToggleAddProduct';
import { Loader } from '@ui/Loader';

import s from './index.module.scss';

export enum ButtonTypes {
	primary = 'primary',
	secondary = 'secondary',
	danger = 'danger',
	success = 'success',
	ghost = 'ghost',
	tertiary = 'tertiary',
}

export enum ButtonSizes {
	small = 'small',
	medium = 'medium',
	big = 'big',
}

export type ButtonProps = {
	children?: ReactNode;
	size?: ButtonSizes;
	bordered?: boolean;
	hovered?: boolean;
	className?: string;
	variant?: ButtonTypes;
	danger?: boolean;
	loading?: boolean;
} & React.ComponentPropsWithoutRef<'button'>;

const Button = ({
	children,
	size = ButtonSizes.small,
	bordered,
	hovered = true,
	className,
	variant = ButtonTypes.primary,
	danger,
	loading,
	...rest
}: ButtonProps) => {
	return (
		<button
			{...rest}
			className={cn([
				className,
				s.button,
				danger && s.button_danger,
				s[`button_${variant}`],
				s[`button_${size}`],
				bordered && s['bordered'],
				hovered && s['hovered'],
			])}
		>
			{children}
			{loading && <Loader className={s.button__loader} />}
		</button>
	);
};

Button.ToggleAddProduct = ButtonToggleAddProduct;

export default Button;
