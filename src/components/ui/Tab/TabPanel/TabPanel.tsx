import React, { ReactNode } from "react";
import styles from "./TabPanel.module.scss";
import classnames from "classnames";

type TabPanelProps = {
    children: ReactNode
    size?: "medium" | "big" | "small" | "xSmall"
    className?: string
    show?: boolean
}

export const TabPanel = ({
                             children,
                             className,
                             show = true
                         }: TabPanelProps) => {
    if (!show) return null;
    return (
        <div
            className={classnames([
                styles.tabPanel,
                className
            ])}
        >
            {children}
        </div>
    );
};
export default TabPanel;
