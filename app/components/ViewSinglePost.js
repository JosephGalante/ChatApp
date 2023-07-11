import React, { useEffect, useState } from 'react'
import Page from './Page'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'
import LoadingSpinner from './LoadingSpinner'
import ReactMarkdown from 'react-markdown'

function ViewSinglePost() {
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
