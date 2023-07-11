import React, { useEffect, useState } from 'react'
import Page from './Page'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'
import LoadingSpinner from './LoadingSpinner'

function ViewSinglePost() {
	const { id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState([])

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, {
					cancelToken: ourRequest.token,
				})
				setPost(response.data)
				setIsLoading(false)
			} catch (error) {
				console.error('There was an error', error)
			}
		}
		fetchPost()
		return () => {
			ourRequest.cancel()
		}
	}, [])

	if (isLoading) {
		return (
			<Page title="...">
				{' '}
				<LoadingSpinner />{' '}
			</Page>
		)
	}

	const dateFormatted = new Date(post.createdDate).toLocaleDateString()

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				<span className="pt-2">
					<a
						href="#"
						className="text-primary mr-2"
						title="Edit">
						<i className="fas fa-edit"></i>
					</a>
					<a
						className="delete-post-button text-danger"
						title="Delete">
						<i className="fas fa-trash"></i>
					</a>
				</span>
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

			<div className="body-content">{post.body}</div>
		</Page>
	)
}

export default ViewSinglePost
