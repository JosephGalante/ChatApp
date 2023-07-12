import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

function ProfileFollow(props) {
	const action = props.action
	const { username } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [follows, setFollows] = useState([])

	useEffect(() => {
    async function fetchFollow() {
			try {
				const response = await Axios.get(`/profile/${username}/${action}`)
				setFollows(response.data)
				setIsLoading(false)
			} catch (error) {
				console.error('There was an error', error)
			}
		}
		fetchFollow()
	}, [username, action])

	if (isLoading) return <LoadingSpinner />

	return (
		<div className="list-group">
			{follows.map((follow, index) => {
				return (
					<Link
						key={index}
						to={`/profile/${follow.username}`}
						className="list-group-item list-group-item-action">
						<img
							className="avatar-tiny"
							src={follow.avatar}
						/>{' '}
						{follow.username}{' '}
					</Link>
				)
			})}
		</div>
	)
}

export default ProfileFollow


