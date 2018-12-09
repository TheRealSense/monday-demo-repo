/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Modal } from 'react-native'

import { connect } from 'react-redux'

import { fonts } from '../theme'
import { createUser, confirmUserSignUp } from '../actions'

import Input from '../components/Input'
import Button from '../components/Button'

const initialState = {
	username: '',
	password: '',
	email: '',
	phone_number: '',
	authCode: ''
}

class SignUp extends Component<{}> {
	state = initialState

	componentWillReceiveProps(nextProps) {

		const { auth } = this.props

		const {
			auth: { showSignUpConfirmationModal }
		} = nextProps
		if (
			!showSignUpConfirmationModal &&
			auth.showSignUpConfirmationModal
		) {
			this.setState(initialState)
		}
	}

	onChangeText = (key, value) => {
		this.setState({
			[key]: value
		})
	}

	signUp() {
		const { username, password, email, phone_number } = this.state
		const { dispatchCreateUser } = this.props
		dispatchCreateUser(username, password, email, phone_number)
	}

	confirm() {
		const { authCode, username } = this.state
		const { dispatchConfirmUser } = this.props
		dispatchConfirmUser(username, authCode)
	}

	render() {
		const {
			auth: {
				showSignUpConfirmationModal,
				isAuthenticating,
				signUpError,
				signUpErrorMessage
			}
		} = this.props

		const { username, email, password, phone_number, authCode } = this.state

		return (
			<View style={styles.container}>
				<View style={styles.heading}>
					<Image
						source={require('../assets/shape.png')}
						style={styles.headingImage}
						resizeMode="contain"
					/>
				</View>
				<Text style={styles.greeting}>Welcome,</Text>
				<Text style={styles.greeting2}>sign up to continue</Text>
				<View style={styles.inputContainer}>
					<Input
						value={username}
						placeholder="User Name"
						type="username"
						onChangeText={this.onChangeText}
					/>
					<Input
						value={email}
						placeholder="Email"
						type="email"
						onChangeText={this.onChangeText}
					/>
					<Input
						value={password}
						placeholder="Password"
						secureTextEntry
						type="password"
						onChangeText={this.onChangeText}
					/>
					<Input
						placeholder="Phone Number"
						type="phone_number"
						onChangeText={this.onChangeText}
						value={phone_number}
					/>
				</View>
				<Button
					title="Sign Up"
					onPress={this.signUp.bind(this)}
					isLoading={isAuthenticating}
				/>
				<Text
					style={[
						styles.errorMessage,
						signUpError && { color: 'black' }
					]}
				>
					Error logging in. Please try again.
				</Text>
				<Text
					style={[
						styles.errorMessage,
						signUpError && { color: 'black' }
					]}
				>
					{signUpErrorMessage}
				</Text>
				{showSignUpConfirmationModal && (
					<Modal>
						<View style={styles.modal}>
							<Input
								placeholder="Authorization Code"
								type="authCode"
								keyboardType="numeric"
								onChangeText={this.onChangeText}
								value={authCode}
							/>
							<Button
								title="Confirm"
								onPress={this.confirm.bind(this)}
								isLoading={isAuthenticating}
							/>
						</View>
					</Modal>
				)}
			</View>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth
})

const mapDispatchToProps = {
	dispatchConfirmUser: (username, authCode) =>
		confirmUserSignUp(username, authCode),
	dispatchCreateUser: (username, password, email, phone_number) =>
		createUser(username, password, email, phone_number)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp)

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputContainer: {
		marginTop: 20
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 40
	},
	greeting: {
		marginTop: 20,
		fontFamily: fonts.light,
		fontSize: 24
	},
	greeting2: {
		fontFamily: fonts.light,
		color: '#666',
		fontSize: 24,
		marginTop: 5
	},
	heading: {
		flexDirection: 'row'
	},
	headingImage: {
		width: 38,
		height: 38
	},
	errorMessage: {
		fontFamily: fonts.base,
		fontSize: 12,
		marginTop: 10,
		color: 'transparent'
	}
})
