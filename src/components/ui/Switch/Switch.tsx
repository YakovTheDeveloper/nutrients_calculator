import classNames from 'classnames';
import React, { useState } from 'react';

import s from './Switch.module.scss';

enum SwitchPosition {
	left = 'left',
	right = 'right',
}
type Props = {
	currentValue: unknown;
	values: [unknown, unknown];
	valuesLabel?: [string, string];
	onChange: (value: unknown) => void;
};

const Switch = ({ currentValue, values, valuesLabel, onChange }: Props) => {
	const currentPosition = currentValue === values[0] ? SwitchPosition.left : SwitchPosition.right;
	const nextPositionValue = currentValue === values[0] ? values[1] : values[0];

	const [pos, setPos] = useState<SwitchPosition>(currentPosition);

	return (
		<div
			className={classNames(s.switch, currentPosition === SwitchPosition.left && s.switch_on)}
			onClick={() => onChange(nextPositionValue)}
		>
			<span
				className={classNames(s.switch__circle, currentPosition === SwitchPosition.right && s.switch__circle_right)}
			/>
			<span className={classNames(s.switch__value, currentPosition === SwitchPosition.left && s.switch__value_left)}>
				{currentValue === values[0] ? valuesLabel[0] : valuesLabel[1]}
			</span>
		</div>
	);
};

export default Switch;
