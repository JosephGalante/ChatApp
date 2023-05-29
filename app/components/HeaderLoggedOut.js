import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function HeaderLoggedOut() {
	const [username, setUsername] = useState()
	const [password, setPassword] = useState()

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const response = await Axios.post('http://localhost:8080/login', {
				username,
				password
			})

			if (response.data) {
				console.log(response.data)
			} else {
				console.log('Incorrect username or password.')
			}
		} catch (error) {
			console.error('There was a problem.')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
			<div className="row align-items-center">
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input
						name="username"
						className="form-control form-control-sm input-dark"
						type="text"
						placeholder="Username"
						autoComplete="off"
						onChange={e => setUsername(e.target.value)}
					/>
				</div>
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input
						name="password"
						className="form-control form-control-sm input-dark"
						type="password"
						placeholder="Password"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<div className="col-md-auto">
					<button className="btn btn-success btn-sm">Sign In</button>
				</div>
			</div>
		</form>
	)
}

export default HeaderLoggedOut
