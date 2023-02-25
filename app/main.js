import React from 'react'
import ReactDOM from 'react-dom'

// Components
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'

function Main() {
	return (
    <>
      <Header />
			<HomeGuest />
      <Footer />
		</>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<Main />)

if (module.hot) {
	module.hot.accept()
}
