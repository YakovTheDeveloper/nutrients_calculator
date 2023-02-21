import React, { useState } from "react";
import styles from "./Input.module.scss";

type InputProps = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    label?: string;
} & React.ComponentPropsWithoutRef<"input">;

const Input = ({ value, setValue, label, ...rest }: InputProps) => {
    const handleClearClick = () => {
        setValue("");
    };
    return (
        <label className={styles.container}>
            {label ? <p>{label}</p> : null}
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                {...rest}
            />
            {value ? (
                <button className={styles.clearBtn} onClick={handleClearClick}>
                    X
                </button>
            ) : (
                ""
            )}
        </label>
    );
};

export default Input;
