/* eslint-disable react/jsx-key */
// import { initNutrients, nutrientDailyNorm } from '@constants/index'

import { nutrientDailyNorm, initNutrients } from '@constants/nutrients'
import { getNutrientTablesByCategory } from '@helpers/mappers'
import { getShortNutrientNameIfHas } from '@helpers/normalizers'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import Indicator from './Indicator'

type TableProps = {
    data: Nutrients.NamesToItems | null
}
// const ITEMS_PER_ROW = 7
// const arrangeInRows = (data: Nutrients.TableItem[], itemsPerRow: number) => {
//     const rows: Array<Nutrients.TableItem[]> = []
//     for (let i = 0; i < Math.ceil(data.length / itemsPerRow); i++) {
//         rows.push(data.slice(i * itemsPerRow, (i + 1) * itemsPerRow))
//     }
//     return rows
// }
const Table = ({ data }: TableProps) => {
    const getDailyNormPercent = (name: Nutrients.Name, value: number) => {
        const norm = nutrientDailyNorm[name]
        return Number(((value / norm) * 100).toFixed(1))
    }

    if (!data) return null
    return (
        // Нет key in iterator

        <section className={classNames(styles.container)}>
            {Object.entries(getNutrientTablesByCategory(data)).map(
                ([nutrientGroupName, nutrients]) => (
                    <table className={styles[nutrientGroupName]}>
                        <tbody>
                            {nutrients.map((item) => (
                                <tr>
                                    <th>
                                        {getShortNutrientNameIfHas(item.name)}
                                    </th>
                                    <td>
                                        {getDailyNormPercent(
                                            item.name,
                                            item.value
                                        )}
                                        %, {item.value} {item.unit}
                                    </td>
                                    <Indicator
                                        percent={getDailyNormPercent(
                                            item.name,
                                            item.value
                                        )}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </section>
    )
}

export default Table
