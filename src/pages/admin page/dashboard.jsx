import React from 'react'
import SideBar from '../../components/Admin Components/sideBar'

const Dashboard = () => {
  return (
    <div className='w-full max-h-[100vh] overflow-hidden flex'>
      <div className='w-[20%] h-[100vh] bg-blue-400   '>
      
      <SideBar />
      </div>

      <div className='w-full bg-slate-900'>

      </div>
    </div>
  )
}

export default Dashboard
