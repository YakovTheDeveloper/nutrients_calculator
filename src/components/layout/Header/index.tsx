import classNames from 'classnames';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import { ModalsEnum } from '@constants/modal';
import { useModalStore } from '@data/modal';
import { useSettings } from '@data/settings';
import { useUserStore } from '@data/user';
import { Button, ButtonSizes, ButtonTypes } from '@ui/Button';
import Switch from '@ui/Switch';

import Nav from './Nav';
import styles from './index.module.scss';

const Header = () => {
	const { user, setUser, setMenus, clearStore } = useUserStore(
		(state) => ({
			user: state.user,
			setUser: state.setUser,
			setMenus: state.setMenus,
			clearStore: state.clearStore,
		}),
		shallow,
	);
	const darkTheme = useSettings((s) => s.darkTheme);
	const toggleDarkTheme = useSettings((s) => s.toggleDarkTheme);
	const { openModal } = useModalStore();

	const logoutHandler = () => {
		clearStore();
	};

	useEffect(() => {
		document.body.setAttribute('data-dark', darkTheme.toString());
	}, [darkTheme]);

	return (
		<header className={styles.header}>
			<Nav />
			<section className={styles.headerAuth}>
				{user ? (
					<div className={styles.headerSection}>
						{/* <span>{user.data.email}</span>*/}
						<Button onClick={logoutHandler} size={ButtonSizes.small} variant={ButtonTypes.secondary}>
							Logout
						</Button>
					</div>
				) : (
					<>
						<Button onClick={() => openModal(ModalsEnum.signup)} bordered size={ButtonSizes.small}>
							Sign Up
						</Button>

						<Button onClick={() => openModal(ModalsEnum.login)} bordered size={ButtonSizes.small}>
							Login
						</Button>
					</>
				)}
			</section>
			<Switch
				currentValue={darkTheme}
				values={[true, false]}
				valuesLabel={['🌙', '☀️']}
				onChange={toggleDarkTheme}
			/>
			<NavLink
				to='/settings'
				className={({ isActive }) => (isActive ? classNames(styles.link, styles.active) : classNames(styles.link))}
			>
				<Button variant={ButtonTypes.tertiary}>Settings</Button>
			</NavLink>
		</header>
	);
};

export default Header;
