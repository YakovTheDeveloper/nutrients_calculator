import Footer from "@layout/Footer";
import Header from "@layout/Header";
import React from "react";
import s from "./index.module.scss";
import { Outlet } from "react-router-dom";
type SplitSectionProps = {
  children: React.ReactNode[];
};

const SplitSection = ({ children }: SplitSectionProps) => {
  return (
    <section className={s.splitSection}>
      {children.map((child) => (
        <div className={s.splitSection__section}>{child}</div>
      ))}
    </section>
  );
};

export default SplitSection;
