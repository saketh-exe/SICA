import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import RouteGuard from './components/RouteGuard'
function App() {

  return (
    
      <Router>

      <Routes>

      <Route 
      path='/'
      element = {<Login/>}  
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
