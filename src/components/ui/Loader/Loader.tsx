import classNames from "classnames";
import React from "react";
import styles from "./Loader.module.scss";

export enum LoaderSize {
    small = "small",
    medium = "medium",
    large = "large"
};

type LoaderProps = {
    className?: string
    size: LoaderSize
}

const Loader = ({ className, size = LoaderSize.small }: LoaderProps) => {
    return <div className={classNames(styles.spinner, className)}></div>;
};

export default Loader;
