import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import { BackgroundBoxesDemo } from './pages/BackgroundBoxesDemo'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import RouteGuard from './components/RouteGuard'
function App() {

  return (
    
      <Router>

      <Routes>

      <Route 
      path='/'
      element = {<BackgroundBoxesDemo/>}  
      />

      <Route
      path='/home'
      element = {
      <RouteGuard>

        <Home/>

      </RouteGuard>
    
    }      
      />



      </Routes>



      </Router>
  )
}

export default App
