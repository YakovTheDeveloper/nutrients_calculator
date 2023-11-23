import styles from "./NutrientNavigation.module.scss";
import { Tab, TabTypes } from "@ui";
import React from "react";

type NavigationProps = {
    show: boolean
    onTabClick: (index: number) => void
    tabNames: string[]
}
const NutrientNavigation = ({ show, onTabClick,tabNames }: NavigationProps) => (
    <div className={styles.nutrients__groupNav}>
        <button
            className={styles.nutrients__groupNavToggleButton}
            // onClick={() => toggleNutrientsSettings("showNav")}
        >
            {show ? "v" : "^"}
        </button>
        {show && (
            <Tab.Panel>
                {tabNames.map((name, index) => (
                    <Tab
                        variant={TabTypes.primary}
                        onClick={() => onTabClick(index)}
                        className={styles.nutrients__groupNavTabsButton}
                    >
                        {name}
                        {/* {groupName.slice(0, 5).toUpperCase()} */}
                    </Tab>
                ))}
                <button
                    // onClick={() => toggleNutrientsSettings("showHidden")}
                >
                    {"<o>"}
                </button>
            </Tab.Panel>
        )}
    </div>
);

export default NutrientNavigation
