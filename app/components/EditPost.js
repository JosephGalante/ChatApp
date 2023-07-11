import React, { useEffect, useState, useContext } from 'react'
import Page from './Page'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'
import LoadingSpinner from './LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import { Tooltip } from 'react-tooltip'
import { useImmerReducer } from 'use-immer'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function ViewSinglePost() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const initialState = {
		title: {
			value: '',
			hasErrors: false,
			message: '',
		},
		body: {
			value: '',
			hasErrors: false,
			message: '',
		},
		isFetching: true,
		isSaving: false,
		id: useParams().id,
		sendCount: 0,
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'fetchComplete':
				draft.title.value = action.value.title
				draft.body.value = action.value.body
				draft.isFetching = false
				break
			case 'titleChange':
				draft.title.hasErrors = false
				draft.title.value = action.value
				break
			case 'bodyChange':
				draft.body.hasErrors = false
				draft.body.value = action.value
				break
			case 'submitRequest':
				if (!draft.title.hasErrors && !draft.body.hasErrors) {
					draft.sendCount++
				}
				break
			case 'saveRequestStarted':
				draft.isSaving = true
				break
			case 'saveRequestFinished':
				draft.isSaving = false
				break
			case 'titleRules':
				if (!action.value.trim()) {
					draft.title.hasErrors = true
					draft.title.message = 'You must provide a title'
				} 
				break
			case 'bodyRules':
				if (!action.value.trim()) {
					draft.body.hasErrors = true
					draft.body.message = 'You must provide a body'
				}
				break
			default:
				break
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)
	function submitHandler(e) {
		e.preventDefault()
		dispatch({ type: 'titleRules', value: state.title.value })
		dispatch({ type: 'bodyRules', value: state.body.value })
		dispatch({ type: 'submitRequest' })
	}

	const { id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState([])

	useEffect(() => {
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${state.id}`)
				dispatch({ type: 'fetchComplete', value: response.data })
			} catch (error) {
				console.error('There was an error', error)
			}
		}
		fetchPost()
	}, [])

	useEffect(() => {
		if (state.sendCount) {
			dispatch({ type: 'saveRequestStarted' })
			async function fetchPost() {
				try {
					const response = await Axios.post(`/post/${state.id}/edit`, {
						title: state.title.value,
						body: state.body.value,
						token: appState.user.token,
					})
					dispatch({ type: 'saveRequestFinished' })
					appDispatch({
						type: 'flashMessage',
						value: 'Post was successfully updated.',
					})
				} catch (error) {
					console.error('There was an error', error)
				}
			}
			fetchPost()
		}
	}, [state.sendCount])

	if (state.isFetching) {
		return (
			<Page title="...">
				{' '}
				<LoadingSpinner />{' '}
			</Page>
		)
	}

	return (
		<Page title="Edit Post">
			<form onSubmit={submitHandler}>
				<div className="form-group">
					<label
						htmlFor="post-title"
						className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input
						autoFocus
						name="title"
						id="post-title"
						className="form-control form-control-lg form-control-title"
						type="text"
						placeholder=""
						autoComplete="off"
						value={state.title.value}
						onChange={(e) =>
							dispatch({ type: 'titleChange', value: e.target.value })
						}
						onBlur={(e) => {
							dispatch({ type: 'titleRules', value: e.target.value })
						}}
					/>
					{state.title.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">
							{state.title.message}
						</div>
					)}
				</div>

				<div className="form-group">
					<label
						htmlFor="post-body"
						className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea
						name="body"
						id="post-body"
						className="body-content tall-textarea form-control"
						type="text"
						value={state.body.value}
						onChange={(e) => {
							dispatch({ type: 'bodyChange', value: e.target.value })
						}}
						onBlur={(e) => {
							dispatch({ type: 'bodyRules', value: e.target.value })
						}}
					/>
					{state.body.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">
							{state.body.message}
						</div>
					)}
				</div>

				<button
					className="btn btn-primary"
					disabled={state.isSaving}>
					{state.isSaving ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</Page>
	)
}

export default ViewSinglePost
