import React, { ReactNode } from "react";
import styles from "./index.module.scss";
import classnames from "classnames";

type TabProps = {
    children: ReactNode
    size?: "medium" | "big" | "small" | "xSmall"
    className?: string
} & React.ComponentPropsWithoutRef<"button">

const Tab = ({
                 children,
                 size = "medium",
                 className,
                 ...rest
             }: TabProps) => {
    return (
        <button
            {...rest}
            className={classnames([
                className,
                styles.tab,
                styles[size]
            ])}
        >
            {children}
        </button>
    );
};

export default Tab;
