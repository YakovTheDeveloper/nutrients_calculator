import React, { ReactNode } from "react";
import s from "./index.module.scss";
import cn from "classnames";

export enum ButtonTypes {
    primary = "primary",
    secondary = "secondary",
    danger = "danger",
    success = "success",
}

type ButtonProps = {
    children: ReactNode
    size?: "medium" | "big" | "small" | "xSmall"
    bordered?: boolean
    hovered?: boolean
    className?: string
    type: ButtonTypes
} & React.ComponentPropsWithoutRef<"button">

const Button = ({
                    children,
                    size = "medium",
                    bordered,
                    hovered = true,
                    className,
                    type,
                    ...rest
                }: ButtonProps) => {
    return (
        <button
            {...rest}
            className={cn([
                className,
                s.button,
                s[size],
                bordered && s["bordered"],
                hovered && s["hovered"]
            ])}
        >
            {children}
        </button>
    );
};

export default Button;
