import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'

function Main() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<HomeGuest />} />
				<Route path="/about-us" element={<About />} />
				<Route path="/terms" element={<Terms />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<Main />)

if (module.hot) {
	module.hot.accept()
}
