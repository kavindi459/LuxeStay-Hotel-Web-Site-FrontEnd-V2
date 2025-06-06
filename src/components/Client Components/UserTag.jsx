import React from 'react'

const UserTag = (props) => {

const {imageLink,name}=props


  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <img className='rounded-full w-10 h-10' src={imageLink} style={{width:"50px",height:"50px"}} alt="" />
      <h1 className='text-lg font-bold '>{name} </h1>
    </div>
  )
}                                                                       

export default UserTag
