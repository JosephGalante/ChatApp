import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import { useImmerReducer } from 'use-immer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:8080'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

// Components
import Header from './components/Header'
import Home from './components/Home'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import CreatePost from './components/CreatePost'
import Terms from './components/Terms'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'
import Profile from './components/Profile'
import EditPost from './components/EditPost'
import Search from './components/Search'
import NotFound from './components/NotFound'

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('complexappToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('complexappToken'),
			username: localStorage.getItem('complexappUsername'),
			avatar: localStorage.getItem('complexappAvatar'),
		},
		isSearchOpen: false,
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true
				draft.user = action.data
				break
			case 'logout':
				draft.loggedIn = false
				break
			case 'flashMessage':
				draft.flashMessages.push(action.value)
				break
			case 'openSearch':
				draft.isSearchOpen = true
				break
			case 'closeSearch':
				draft.isSearchOpen = false
				break
			default:
				break
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('complexappToken', state.user.token)
			localStorage.setItem('complexappUsername', state.user.username)
			localStorage.setItem('complexappAvatar', state.user.avatar)
		} else {
			localStorage.removeItem('complexappToken')
			localStorage.removeItem('complexappUsername')
			localStorage.removeItem('complexappAvatar')
		}
	}, [state.loggedIn])

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Routes>
						<Route
							path="/"
							element={state.loggedIn ? <Home /> : <HomeGuest />}
						/>
						<Route
							path="/post/:id"
							element={<ViewSinglePost />}
						/>
						<Route
							path="/post/:id/edit"
							element={<EditPost />}
						/>
						<Route
							path="/about-us"
							element={<About />}
						/>
						<Route
							path="/terms"
							element={<Terms />}
						/>
						<Route
							path="/create-post"
							element={<CreatePost />}
						/>
						<Route
							path="/profile/:username/*"
							element={<Profile />}
						/>
						<Route
							path="*"
							element={<NotFound />}
						/>
					</Routes>
					<CSSTransition
						timeout={330}
						in={state.isSearchOpen}
						classNames="search-overlay"
						unmountOnExit>
						<Search />
					</CSSTransition>
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<Main />)

if (module.hot) {
	module.hot.accept()
}
