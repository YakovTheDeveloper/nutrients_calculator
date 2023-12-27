import classNames from 'classnames';
import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '@layout/Footer';
import Header from '@layout/Header';

import s from './index.module.scss';

const Layout = () => {
	return (
		<div className={s.layout}>
			<Header />
			<main className={classNames(s.main)}>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
