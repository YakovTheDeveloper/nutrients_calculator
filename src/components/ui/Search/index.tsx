import { apiBaseAddress } from "@constants/api";
import { useProductStore } from "@data/products";
import { useKeyPressed } from "@hooks/useKeyPress";
import Input from "@ui/Input/Input";
import Table from "@ui/Table";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

type SearchProps = {};

const Search = ({}: SearchProps) => {
    const [data, setData] = useState<null | Products.Item[]>(null);
    const addProduct = useProductStore((state) => state.addProductToSelected);
    const selectedProducts = useProductStore((state) => state.selectedProducts);

    const [searchText, setSearchText] = useState("");

    const get = () => {
        console.log(`${apiBaseAddress}/polls/get_product/?name=${searchText}`);
        fetch(`${apiBaseAddress}/polls/get_product/?name=${searchText}`)
            .then((res) => res.json())
            .then((res: { result: Products.Item[] }) => {
                setData(res.result);
            });
    };
    useKeyPressed("Enter", get);

    useEffect(() => {
        get();
    }, [searchText]);

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <Input
                    className={styles.input}
                    type="text"
                    placeholder="Enter the product"
                    value={searchText}
                    setValue={setSearchText}
                ></Input>

                <button className={styles.searchBtn} onClick={get}>
                    Search
                </button>
            </div>

            {data?.map((item) => (
                <div
                    onClick={() =>
                        addProduct({
                            ...item,
                            quantity: 0,
                        })
                    }
                >
                    {item.name} ({item.state})
                    {item.id in selectedProducts ? <span>✅</span> : null}
                </div>
            ))}
        </div>
    );
};

export default Search;
