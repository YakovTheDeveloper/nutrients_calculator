import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';
import { useUserStore } from '@data/user';

const LINKS_GUEST = [
	{ to: '/', label: 'search' },
	{ to: 'products_tier', label: 'products tier' },
];

const LINKS_USER = [
	...LINKS_GUEST,
	{ to: 'menu', label: 'menu' },
	{ to: 'my_products', label: 'my products' },
];

const Nav = () => {

	const user = useUserStore(s => s.user);

	const LINKS = user ? LINKS_USER : LINKS_GUEST;

	return (
		<nav className={styles.nav}>
			{LINKS.map((link) => (
				<NavLink
					to={link.to}
					key={link.to}
					className={({ isActive }) =>
						isActive
							? classNames(styles.link, styles.active)
							: classNames(styles.link)
					}
				>
					{link.label}
				</NavLink>
			))}
		</nav>
	);
};

export default Nav;
