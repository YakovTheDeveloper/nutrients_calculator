import React from 'react';
import { ModalPage } from './ModalPage';
import LoginForm from '@forms/LoginForm';
import { ModalsEnum } from '@constants/modal';
import SignupForm from '@forms/SignupForm';

const ModalRoot = () => {
	return (
		<div>
			<ModalPage id={ModalsEnum.login}>
				<LoginForm/>
			</ModalPage>
			<ModalPage id={ModalsEnum.signup}>
				<SignupForm/>
			</ModalPage>
		</div>
	);
};

export default ModalRoot;