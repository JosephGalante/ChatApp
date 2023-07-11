import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function ProfilePosts() {
	const { username } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [posts, setPosts] = useState([])

	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`)
				setPosts(response.data)
				setIsLoading(false)
			} catch (error) {
				console.error('There was an error', error)
			}
		}
		fetchPosts()
	}, [])

	if (isLoading) {
		return <div>Loading ...</div>
	}

	return (
		<div className="list-group">
			{posts.map((post) => {
				const dateFormatted = new Date(post.createdDate).toLocaleDateString()
				return (
					<Link
						key={post._id}
						to={`/post/${post._id}`}
						className="list-group-item list-group-item-action">
						<img
							className="avatar-tiny"
							src={post.author.avatar}
						/>{' '}
						<strong>{post.title}</strong>{' '}
						<span className="text-muted small">on {dateFormatted} </span>
					</Link>
				)
			})}
		</div>
	)
}

export default ProfilePosts
