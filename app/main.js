import Axios from 'axios'
import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useImmerReducer } from 'use-immer'
Axios.defaults.baseURL =
	process.env.BACKENDURL || 'https://chatapp-react-backend.onrender.com'

import DispatchContext from './DispatchContext'
import StateContext from './StateContext'

// Components
import About from './components/About'
import FlashMessages from './components/FlashMessages'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './components/Home'
import HomeGuest from './components/HomeGuest'
import LoadingSpinner from './components/LoadingSpinner'
import NotFound from './components/NotFound'
import Terms from './components/Terms'
const Chat = React.lazy(() => import('./components/Chat'))
const CreatePost = React.lazy(() => import('./components/CreatePost'))
const EditPost = React.lazy(() => import('./components/EditPost'))
const Profile = React.lazy(() => import('./components/Profile'))
const Search = React.lazy(() => import('./components/Search'))
const ViewSinglePost = React.lazy(() => import('./components/ViewSinglePost'))

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
		isChatOpen: false,
		unreadChatCount: 0,
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
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen
				break
			case 'closeChat':
				draft.isChatOpen = false
				break
			case 'incrementUnreadChatCount':
				draft.unreadChatCount++
				break
			case 'clearUnreadChatCount':
				draft.unreadChatCount = 0
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

	// Check if token has expired on first render
	useEffect(() => {
		if (state.loggedIn) {
			const ourRequest = Axios.CancelToken.source()
			async function fetchResults() {
				try {
					const response = await Axios.post(
						`/checkToken`,
						{
							token: state.user.token,
						},
						{ cancelToken: ourRequest.token }
					)
					if (!response.data) {
						dispatch({ type: 'logout' })
						dispatch({
							type: 'flashMessage',
							value: 'Your session has expired. Please log in again.',
						})
					}
				} catch (error) {
					console.error('There was an error', error)
				}
			}
			fetchResults()

			return () => ourRequest.cancel()
		}
	}, [])

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Suspense fallback={<LoadingSpinner />}>
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
					</Suspense>
					<CSSTransition
						timeout={330}
						in={state.isSearchOpen}
						classNames="search-overlay"
						unmountOnExit>
						<div className="search-overlay">
							<Suspense fallback="">
								{' '}
								<Search />{' '}
							</Suspense>
						</div>
					</CSSTransition>
					<Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
