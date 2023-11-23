import React from 'react';
import Nav from './Nav';
import styles from './index.module.scss';
import { shallow } from 'zustand/shallow';
import { useUserStore } from '@data/user';
import { Button, ButtonSizes, ButtonTypes } from '@ui/Button';
import { useModalStore } from '@data/modal';
import SignupForm from '@forms/SignupForm';
import LoginForm from '@forms/LoginForm';
import Settings from '@pages/nutrientNorms/NutrientNorms';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { ModalsEnum } from '@constants/modal';

const Header = () => {
	const { user, setUser, setMenus, clearStore } = useUserStore(
		(state) => ({
			user: state.user,
			setUser: state.setUser,
			setMenus: state.setMenus,
			clearStore: state.clearStore
		}),
		shallow
	);

	const { openModal } = useModalStore();

	const logoutHandler = () => {
		clearStore();
	};

	return (
		<header className={styles.header}>
			<Nav />
			<section className={styles.headerAuth}>
				{user ? (
					<div className={styles.headerSection}>
						{/*<span>{user.data.email}</span>*/}
						<Button
							onClick={logoutHandler}
							size={ButtonSizes.small}
							variant={ButtonTypes.secondary}
						>
                            Logout
						</Button>
					</div>
				) : (
					<>
						<Button
							onClick={() =>
								openModal(
									ModalsEnum.signup
								)
							}
							bordered
							size={ButtonSizes.small}
						>
                            Sign Up
						</Button>

						<Button
							onClick={() =>
								openModal(
									ModalsEnum.login
								)
							}
							bordered
							size={ButtonSizes.small}
						>
                            Login
						</Button>
					</>
				)}

			</section>
			<NavLink
				to="/settings"
				className={({ isActive }) =>
					isActive
						? classNames(styles.link, styles.active)
						: classNames(styles.link)
				}
			>
				<Button variant={ButtonTypes.tertiary}>
                    Settings
				</Button>
			</NavLink>


		</header>
	);
};

export default Header;
