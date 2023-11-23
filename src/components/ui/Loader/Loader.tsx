import classNames from "classnames";
import React from "react";
import styles from "./Loader.module.scss";

type LoaderProps = {
    className?: string
}

export enum LoaderSize {
    small = "small",
    medium = "medium",
    large = "large"
};

const Loader = ({ className, size }: LoaderProps) => {
    return <div className={classNames(styles.spinner, className)}></div>;
};

export default Loader;
