import { useSettings } from '@data/settings';
import React from 'react';
import s from './NormPercentBar.module.scss';
import { getDailyNormPercent } from '@helpers/calculations/getDailyNormPercent';

type Props = {
    item: Nutrients.Item
}

const NormPercentBar = ({item}:Props) => {
	// const getCurrentNorm = useSettings(s => s.getCurrentNorm);
    
	const {code,amount} = item;
	const percent = getDailyNormPercent(code, amount);
	const progressStyle =
        percent != null
        	? {
        		width: percent > 100 ? '100%' : `${percent}%`
        	}
        	: {};

	return (
		<span
			className={s.normPercentBar}
			style={progressStyle}
		/>
	);
};

export default NormPercentBar;