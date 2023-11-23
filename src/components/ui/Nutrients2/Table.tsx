import React, { memo, useRef } from "react";
import styles from "./Nutrients.module.scss";
import { getDailyNormPercent } from "@helpers/calculations/getDailyNormPercent";
import { nutrientDailyNormCode } from "@constants/nutrients";
import cn from "classnames";
import { useSettings } from "@data/settings";
import { useNutrientsStore } from "@data/nutrients";
import { Tab, TabTypes } from "@ui";

type GroupData = {
    name: string;
    tabName: string;
    content: Nutrients.Item[];
};

type NutrientsProps = {
    data: Nutrients.Item[];
};

const Nutrients = ({ data }: NutrientsProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nutrientsSettings = useSettings((state) => state.nutrientsSettings);

    const nutrientVisibilityMapping = useNutrientsStore(
        (state) => state.nutrientVisibilityMapping
    );
    const currentNormId = useSettings(state => state.calcSettings.currentNormId);
    const nutrientNorms = useNutrientsStore(
        (state) => state.nutrientNorms
    );
    const toggleNutrientVisibility = useNutrientsStore(
        (state) => state.toggleNutrientVisibility
    );
    const isNutrientHidden = useNutrientsStore((state) => state.isNutrientHidden);
    const toggleNutrientsSettings = useSettings(
        (state) => state.toggleNutrientsSettings
    );
    console.log("nutrientsSettings", nutrientsSettings);
    const currentNorm = nutrientNorms.find(norm => norm.id === currentNormId);

    const groups: Nutrients.Groups<GroupData> = {
        primary: {
            name: "Primary",
            tabName: "Primary",
            content: []
        },
        carbohydrate: {
            name: "Carbohydrates",
            tabName: "Carbs",
            content: []
        },
        mineral: {
            name: "Minerals",
            tabName: "Minerals",
            content: []
        },
        vitamin_b: {
            name: "Vitamins B",
            tabName: "B",
            content: []
        },
        vitamin_rest: {
            name: "Vitamins rest",
            tabName: "Vitamins rest",
            content: []
        },
        aminoacid: {
            name: "Amino acids",
            tabName: "Amino acids",
            content: []
        },
        rest: {
            name: "Other Components",
            tabName: "Other",
            content: []
        }
    };

    for (const nutrient of data) {
        let groupName = nutrient.group_name;
        if (!groupName) groupName = "rest";

        groups[groupName].content.push(nutrient);
    }

    const scrollRefs = Object.keys(groups).map(() => useRef(null));

    const handleClick = (index: number) => {
        if (scrollRefs[index].current && containerRef.current) {
            const element = scrollRefs[index].current;
            const container = containerRef.current;

            // Calculate the element's position relative to the container
            const offsetTop = element?.offsetTop - container?.offsetTop;

            if (offsetTop !== undefined && container.scrollTo) {
                container.scrollTo({
                    top: offsetTop
                });
            }
        }
    };

    const Navigation = () => (
        <div className={styles.nutrients__groupNav}>
            <button
                className={styles.nutrients__groupNavToggleButton}
                onClick={() => toggleNutrientsSettings("showNav")}
            >
                {nutrientsSettings.showNav ? "v" : "^"}
            </button>
            {nutrientsSettings.showNav && (
                <Tab.Panel>
                    {Object.values(groups).map((group, index) => (
                        <Tab
                            type={TabTypes.primary}
                            onClick={() => handleClick(index)}
                            className={styles.nutrients__groupNavTabsButton}
                        >
                            {group.tabName}
                            {/* {groupName.slice(0, 5).toUpperCase()} */}
                        </Tab>
                    ))}
                    <button onClick={() => toggleNutrientsSettings("showHidden")}>
                        {"<o>"}
                    </button>
                </Tab.Panel>
            )}
        </div>
    );

    const emptyGroups = Object.values(groups).every(
        (group) => group.content.length === 0
    );

    if (emptyGroups) return null;

    return (
        <div>
            {Navigation()}
            <div className={styles.nutrients} ref={containerRef}>
                {Object.values(groups).map((nutrient, index) => (
                    <ul
                        key={nutrient.name}
                        className={styles.list}
                        ref={scrollRefs[index]}
                    >
                        <div>
                            <h2 className={styles.listTitle}>{nutrient.name}</h2>
                        </div>

                        <li className={cn(styles.listItem, styles.listItem_header)}>
                            <span className={styles.listItemName}>Name</span>
                            <span className={styles.listItemName}>%</span>
                            <span className={styles.listItemName}>Value</span>
                            <span className={styles.listItemName}>Unit</span>
                        </li>
                        {nutrient.content.length === 0 && <p>N/A</p>}

                        {nutrient.content.map(
                            ({ id, amount, code, name, unit }: Nutrients.Item) => {
                                const hidden = isNutrientHidden(id);
                                const percent = getDailyNormPercent(code, amount, currentNorm);
                                const progressStyle =
                                    percent != null
                                        ? {
                                            width: percent > 100 ? "100%" : `${percent}%`
                                        }
                                        : {};

                                if (!nutrientsSettings.showHidden && hidden) return null;
                                return (
                                    <li
                                        key={id}
                                        className={cn(
                                            styles.listItem,
                                            hidden && styles.listItem_hidden
                                        )}
                                    >
                                        <span className={styles.listItemName}>{name}</span>
                                        <span className={styles.listItemPercent}>
                                            {console.log(nutrientDailyNormCode, code)}
                                            {nutrientDailyNormCode.nameToQuantityMapping[code] && (
                                                <>
                          <span
                              className={styles.listItemPercent__progress}
                              style={progressStyle}
                          />
                                                    <span className={styles.listItemPercent__value}>
                            {percent}
                          </span>
                                                </>
                                            )}
                    </span>
                                        <span className={styles.listItemValue}>{amount}</span>
                                        <span className={styles.listItemUnit}>
                      {unit}
                                            <button
                                                className={styles.listItemToggleVisibilityButton}
                                                // onClick={() => toggleNutrientVisibility(id)}
                                                onMouseDown={() => toggleNutrientVisibility(id)}
                                            >
                        {"<o>"}
                      </button>
                    </span>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default memo(Nutrients);
