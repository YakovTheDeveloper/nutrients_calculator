import cn from 'classnames';
import React, { ForwardedRef } from 'react';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

import ClearButton from '@ui/Button/ClearButton';

import s from './Input.module.scss';

type InputProps = {
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	size: 'medium' | 'big' | 'small';
	name?: string;
	type: string;
	required?: boolean;
	onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	min?: string;
	children?: React.ReactNode;
	onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
	pattern: string;
	title: string;
	after: React.ReactNode;
	onClear?: VoidFunction;
	error?: {
		itself: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
		message: string;
	};
};

function isNumber(value: string) {
	const pattern = /^\d+\.?\d*$/;

	return pattern.test(value); // returns a boolean
}

const Input = React.forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
	const {
		value,
		onChange,
		label,
		size,
		name,
		type,
		required,
		onBlur,
		placeholder,
		className,
		disabled,
		children,
		onKeyDown,
		pattern,
		title,
		after,
		onClear,
		error,
	} = props;

	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value },
		} = event;

		if (type === 'number') {
			if (value === '') {
				onChange(event);

				return;
			}

			if (!isNumber(value)) {
				return;
			}
		}
		onChange(event);
	};

	const getValue = () => {
		if (type === 'number') {
			const val = value.toString();

			if (val.length > 1 && val[0] === '0') {
				return val.slice(1);
			}

			return value;
		}

		return value;
	};

	return (
		<label className={cn(className, s.input)}>
			{label ? <p className={s.label}>{label}</p> : null}
			<div className={cn(s.inputContainer, error?.itself && s.inputContainer_error)}>
				<input
					ref={ref}
					value={getValue()}
					onChange={onChangeHandler}
					className={cn(
						s[size],
						s.input__item,
						after && s.input_offset,
						onClear && s.input_offset,
						error && s.input__item_error,
					)}
					name={name}
					type={type}
					onBlur={onBlur}
					required={required}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
					disabled={disabled}
					pattern={pattern}
					title={title}
				/>
				{after && <span className={s.inputContainer__after}>{after}</span>}
				{onClear && (
					<span className={cn(s.inputContainer__after, s.input__itemClearButton)}>
						<ClearButton show={true} onClick={onClear} />
					</span>
				)}
				{children}
			</div>
			{error?.itself && <p className={s.input__errorMessage}>{error.message}</p>}
		</label>
	);
});

export default Input;
