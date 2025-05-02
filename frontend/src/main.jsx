// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Dashboard from './Dashboard.jsx'
// import ExperienceSection from './components/ExperienceSection.jsx'
import { BrowserRouter } from 'react-router-dom'
// import ProductSection from './components/ProductSection.jsx'
// import Footer from './components/Footer.jsx'
// import ProductForm from './components/ProductForm.jsx'
// import Navbar from './components/navbar.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <Navbar /> */}
    <App />
    {/* <ExperienceSection /> */}
    {/* <ProductSection /> */}
    {/* <Dashboard /> */}
    {/* <Footer /> */}
    {/* <ProductForm /> */}
  </BrowserRouter>,
)
