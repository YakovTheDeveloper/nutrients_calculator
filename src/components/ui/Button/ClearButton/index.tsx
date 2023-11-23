import React from 'react';
import { Button, ButtonTypes } from '..';
import { DeleteIcon } from '@assets/icons';
import classNames from 'classnames';
import styles from './index.module.scss';

type ClearButtonProps = {
    show?: boolean
    className?: string
    onClick: () => void
}

const ClearButton = ({ show = true, className, onClick }: ClearButtonProps) => {
	return show ? (
		<Button
			variant={ButtonTypes.ghost}
			onClick={onClick}
			className={classNames(className, styles.container)}
			type="button"
		>
            x
		</Button>
	) : null;
};

export default ClearButton;
