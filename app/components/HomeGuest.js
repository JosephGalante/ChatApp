import React, { useState } from 'react'
import Page from './Page'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'
import { CSSTransition } from 'react-transition-group'

function HomeGuest() {
	const initialState = {
		username: {
			value: '',
			hasErrors: false,
			message: '',
		},
		email: {
			value: '',
			hasErrors: false,
			message: '',
		},
		password: {
			value: '',
			hasErrors: false,
			message: '',
		},
		submitCount: 0,
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'usernameImmediately':
				console.log('action', action);
				draft.username.hasErrors = false
				draft.username.value = action.value
				if (draft.username.value.length > 30) {
					draft.username.hasErrors = true
					draft.username.message = 'Username cannot exceed 30 characters.'
				}
				if (
					draft.username.value &&
					!/^([a-zA-Z0-9]+)$/.test(draft.username.value)
				) {
					draft.username.hasErrors = true
					draft.username.message =
						'Username can only contain letters and numbers.'
				}
				break
			case 'usernameAfterDelay':
				if (draft.username.value.length < 3) {
					draft.username.hasErrors = true
					draft.username.message = 'Username must be at least 3 characters.'
				}
				break
			case 'usernameUniqueResults':
				if (action.value) {
					draft.username.hasErrors = true
					draft.username.message = 'That username is already taken.'
				}
				break
			case 'emailImmediately':
				draft.email.hasErrors = false
				draft.email.value = action.value
				break
			case 'emailAfterDelay':
				if (!/^\S+@\S+$/.test(draft.email.value)) {
					draft.email.hasErrors = true
					draft.email.message = 'You must provide a valid email address.'
				}
				break
			case 'emailUniqueResults':
				if (action.value) {
					draft.email.hasErrors = true
					draft.email.message = 'That email is already being used.'
				}
				break
			case 'passwordImmediately':
				draft.password.hasErrors = false
				draft.password.value = action.value
				if (draft.password.value.length > 50) {
					draft.password.hasErrors = true
					draft.password.message = 'Password cannot exceed 50 characters.'
				}
				break
			case 'passwordAfterDelay':
				if (draft.password.value.length < 12) {
					draft.password.hasErrors = true
					draft.password.message = 'Password must be at least 12 characters.'
				}
				break
			case 'submitForm':
				if (
					!draft.username.hasErrors &&
					!draft.email.hasErrors &&
					!draft.password.hasErrors
				) {
					draft.submitCount++
				}
				break
			default:
				break
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	function handleSubmit(e) {
		e.preventDefault()
	}

	return (
		<Page
			wide={true}
			title="Home">
			<div className="row align-items-center">
				<div className="col-lg-7 py-3 py-md-5">
					<h1 className="display-3">Remember Writing?</h1>
					<p className="lead text-muted">
						Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
						posts that are reminiscent of the late 90&rsquo;s email forwards? We
						believe getting back to actually writing is the key to enjoying the
						internet again.
					</p>
				</div>
				<div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label
								htmlFor="username-register"
								className="text-muted mb-1">
								<small>Username</small>
							</label>
							<input
								id="username-register"
								name="username"
								className="form-control"
								type="text"
								placeholder="Pick a username"
								autoComplete="off"
								onChange={(e) => {
									dispatch({
										type: 'usernameImmediately',
										value: e.target.value,
									})
								}}
							/>
							<CSSTransition
								in={state.username.hasErrors}
								timeout={330}
								classNames="liveValidateMessage"
								unmountOnExit>
								<div className="alert alert-danger small liveValidateMessage">
									{state.username.message}
								</div>
							</CSSTransition>
						</div>
						<div className="form-group">
							<label
								htmlFor="email-register"
								className="text-muted mb-1">
								<small>Email</small>
							</label>
							<input
								id="email-register"
								name="email"
								className="form-control"
								type="text"
								placeholder="you@example.com"
								autoComplete="off"
								onChange={(e) => {
									dispatch({
										type: 'emailImmediately',
										value: e.target.value,
									})
								}}
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor="password-register"
								className="text-muted mb-1">
								<small>Password</small>
							</label>
							<input
								id="password-register"
								name="password"
								className="form-control"
								type="password"
								placeholder="Create a password"
								onChange={(e) => {
									dispatch({
										type: 'passwordImmediately',
										value: e.target.value,
									})
								}}
							/>
						</div>
						<button
							type="submit"
							className="py-3 mt-4 btn btn-lg btn-success btn-block">
							Sign up for ComplexApp
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default HomeGuest
