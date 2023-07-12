import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import Post from './Post'

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
	}, [username])

	if (isLoading) return <LoadingSpinner />

	return (
		<div className="list-group">
			{posts.map((post) => {
				return (
					<Post
						post={post}
						key={post._id}
						noAuthor={true}
					/>
				)
			})}
		</div>
	)
}

export default ProfilePosts
