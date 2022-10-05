
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppHeader from './layout/Header'
import Home from '../pages/Home'
import Event from '../pages/Event'
import Payout from '../components/Payout/Payout'

function App() {



  return (
    <Router>
      <div className="App">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/payout" element={<Payout />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App
