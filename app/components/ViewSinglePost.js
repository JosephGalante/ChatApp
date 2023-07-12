import React, { useEffect, useState, useContext } from 'react'
import Page from './Page'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import LoadingSpinner from './LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import { Tooltip } from 'react-tooltip'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function ViewSinglePost() {
	const navigate = useNavigate()
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)
	const { id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState([])

	useEffect(() => {
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`)
				setPost(response.data)
				setIsLoading(false)
			} catch (error) {
				console.error('There was an error', error)
			}
		}
		fetchPost()
	}, [])

	if (!isLoading && !post) {
		return <NotFound />
	}

	if (isLoading) {
		return (
			<Page title="...">
				{' '}
				<LoadingSpinner />{' '}
			</Page>
		)
	}

	const dateFormatted = new Date(post.createdDate).toLocaleDateString()
	function isOwner() {
		return appState.loggedIn && appState.user.username === post.author.username
	}

	async function deleteHandler() {
		const areYouSure = window.confirm('Do you really want to delete this post?')

		if (areYouSure) {
			try {
				const response = await Axios.delete(`/post/${id}`, {
					data: { token: appState.user.token },
				})
				if (response.data === 'Success') {
					appDispatch({
						type: 'flashMessage',
						value: 'Post was successfully deleted.',
					})
					navigate(`/profile/${appState.user.username}`)
				}
			} catch (error) {
				console.error('There was an error', error)
			}
		}
	}

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				{isOwner() && (
					<span className="pt-2">
						<Link
							to={`/post/${post._id}/edit`}
							data-tooltip-content="Edit"
							data-tooltip-id="edit"
							className="text-primary mr-2">
							<i className="fas fa-edit"></i>
						</Link>
						<Tooltip
							id="edit"
							class="custom-tooltip"
						/>{' '}
						<a
							data-tooltip-content="Delete"
							data-tooltip-id="delete"
							className="delete-post-button text-danger"
							onClick={deleteHandler}>
							<i className="fas fa-trash"></i>
						</a>
						<Tooltip
							id="delete"
							class="custom-tooltip"
						/>
					</span>
				)}
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img
						className="avatar-tiny"
						src={post.author.avatar}
					/>
				</Link>
				Posted by{' '}
				<Link to={`/profile/${post.author.username}`}>
					{post.author.username}
				</Link>{' '}
				on {dateFormatted}
			</p>

			<div className="body-content">
				<ReactMarkdown
					children={post.body}
					allowedElements={[
						'p',
						'br',
						'strong',
						'ul',
						'li',
						'ol',
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
					]}
				/>
			</div>
		</Page>
	)
}

export default ViewSinglePost
