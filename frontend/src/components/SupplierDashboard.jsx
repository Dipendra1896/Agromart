import { useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import ExperienceSection from './ExperienceSection'
import AgriInputsSection from './AgriInputsSection'
import SupplierFooter from './SupplierFooter'
import '../styles/FarmerDashboard.css' // Reusing the same CSS
import AgriInputsForm from './AgriInputsForm'

function SupplierDashboard() {
  const [showAgriInputsForm, setShowAgriInputsForm] = useState(false)

  const toggleAgriInputsForm = () => {
    setShowAgriInputsForm(!showAgriInputsForm)
  }

  return (
    <div className="farmer-dashboard">
      <Navbar onAddAgriInputsClick={toggleAgriInputsForm} toggleCart={null} />
      
      <main className="dashboard-content">
        <HeroSection />
        <ExperienceSection />
        <AgriInputsSection dashboardType="supplier" />
      </main>
      
      <SupplierFooter />
      
      {/* Render AgriInputsForm as an overlay */}
      {showAgriInputsForm && <AgriInputsForm onClose={() => setShowAgriInputsForm(false)} />}
    </div>
  )
}

export default SupplierDashboard 