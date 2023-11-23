import cn from "classnames";
import React from "react";
import s from "./ProductSearchListItem.module.scss";

type ProductSearchListItemProps = {
  data: {
    name: string;
    description: string[];
  };
  isChosen: boolean;
  onClick: VoidFunction;
  tabIndex: number;
};

const ProductSearchListItem = ({
  data,
  isChosen,
  onClick,
  tabIndex,
}: ProductSearchListItemProps) => {
  const { name, description } = data;
  const action = isChosen ? () => null : onClick;
  return (
    <li
      tabIndex={tabIndex}
      className={cn(s.listItem, isChosen && s.listItem_chosen)}
      onClick={action}
      onKeyDown={(e) => e.code === "Enter" && action()}
    >
      {isChosen ? <span className={s.listItem__chosenLabel}>✅</span> : null}
      {name}
      <p className={s.listItem__description}>({description.join(", ")})</p>
    </li>
  );
};

export default ProductSearchListItem;
