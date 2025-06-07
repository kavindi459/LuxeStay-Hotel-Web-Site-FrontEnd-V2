import React, { useState } from 'react'

const AdminCategories = () => {
 
  const [num, setNum] = useState(0)

  const increment = () =>{
    setNum(num + 1)
  }

  const decrement =()=>{
    setNum(num -1)
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      

      <div className=" flex justify-center items-center h-[350px] w-[350px] bg-amber-200 gap-6">
       
       <button 
        onClick={increment}
       className='bg-black text-white p-2 rounded-md'>+</button>

       <span className='text-2xl text-red-950 font-bold'>{num}</span>

       <button 
       onClick={decrement}
       className='bg-black text-white p-2 rounded-md'>-</button>

      </div>
    </div>
  )
}

export default AdminCategories
