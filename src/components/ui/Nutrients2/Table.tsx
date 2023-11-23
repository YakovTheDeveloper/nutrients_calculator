import React, { memo, useRef } from 'react';
import styles from './Table.module.scss';
import { getDailyNormPercent } from '@helpers/calculations/getDailyNormPercent';
import { nutrientDailyNormCode } from '@constants/nutrients';
import cn from 'classnames';
import { useSettings } from '@data/settings';
import { useNutrientsStore } from '@data/nutrients';
import { Tab, TabTypes } from '@ui';
import classnames from 'classnames';
import loginForm from '@forms/LoginForm';

type GroupData = {
    name: string;
    tabName: string;
    content: Nutrients.Item[];
};

type NutrientsProps = {
    data: Nutrients.Item[];
};

const MOCK = [
	{
		name: 'Protein',
		percent: '123',
		value: 'value',
		unit: 'unit'
	},
	{
		name: '1',
		percent: '2',
		value: '3',
		unit: '4'
	},
	{
		name: 'name',
		percent: 'percent',
		value: 'value',
		unit: 'unit'
	},
	{
		name: 'name',
		percent: 'percent',
		value: 'value',
		unit: 'unit'
	}
];


type TableProps<COL> = {
    data: COL[];
    render?: Record<string, (data: COL) => React.ReactNode>;
    columns: { key: string, label: React.ReactNode }[];
    heading?: React.ReactNode;
    style?: React.CSSProperties
    emptyPlaceholder?: React.ReactNode
    highlight?: {
        show?: boolean,
        color?: string
    }
    showHeader?: boolean
    hiddenIds?: string[]
    hide?: {
        ids:string[],
    }
}

//5 2 2 1
function generateGridHighlightRules(columnCount: number, className: string, color: string) {
	let cssRules = '';

	for (let i = 0; i < columnCount; i++) {
		const selector = `.${className}:nth-child(${columnCount * 2}n + ${i + 1})`;
		cssRules += `${selector}, `;
	}

	cssRules = cssRules.slice(0, -2);
	cssRules += ` {\n  background-color: ${color};\n}\n`;

	return cssRules;
}

function generateId(length: number = 10) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

const defaultHighlight = {
	show: true,
	color: 'rgb(244, 246, 255)'
};

const Table = React.forwardRef((props: TableProps<COL>, ref?: React.Ref<HTMLDivElement>) => {
	const {
		data,
		heading,
		columns,
		style,
		render = {},
		emptyPlaceholder,
		highlight = defaultHighlight,
		showHeader = true,
		hide
	} = props;

	const highlightConfig = { ...defaultHighlight, ...highlight };

	const classNameHashed = `tableCell_${generateId()}`;

	const gridTemplateColumnsDefaultStyle = {
		gridTemplateColumns: `repeat(${columns.length}, 1fr)`
	};

	const renderCellContent = (key: string, data: T) => {
		const renderFn = render[key];
		if (renderFn) return renderFn(data);

		if(data[key] != null) return data[key];
		return 'N/A';
	};

	const isEmpty = data.length === 0;

	const shouldHide = (id: string) => {
		if(!hide) return false;
		if(hide.ids?.includes(id)) return true;
		return false;
	};


	return (

		<div className={styles.table}
			ref={ref}>
			{heading && <h2 className={styles.listTitle}>{heading}</h2>}

			<div
				className={styles.tableContent}
				style={{ ...gridTemplateColumnsDefaultStyle, ...style }}
				// ref={scrollRefs[index]}
			>
				{isEmpty
					? emptyPlaceholder
					: showHeader ? columns.map(({ label }) => (
						<div
							className={cn(styles.tableContentCell)}>
							{label}
						</div>
					)) : null}

				{data?.map((row) => {
					const id = row.id?.toString();
	
					return (
						<div className={cn(styles.test, shouldHide(id) && styles.test_mark ) }>
							{columns.map(({ key }) => (
								<div
									key={key}
									className={cn(classNameHashed, styles.tableContentCell)}>
									{renderCellContent(key, row)}
								</div>

							))}
						</div>
					);
				})}

				{/* {highlightConfig.show && <style>
					{generateGridHighlightRules(columns.length, classNameHashed, highlightConfig.color)}
				</style>} */}

			</div>

		</div>

	);


});


export default memo(Table);
