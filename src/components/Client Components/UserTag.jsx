import React ,{useState,useEffect} from 'react'
import axios from 'axios'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const UserTag = () => {

  const [name, setName] = useState('');
  const [imageLink, setImageLink] = useState();
 const [userFound, setUserFound] = useState(false);


  

  
 useEffect(()=>{

  const token = localStorage.getItem('token');

 if(token !== null){
    //console.log(token)

    axios.get(`${BACKEND_URL}/api/users/getuserprofile`,
       { 
        headers: { 
          Authorization: `Bearer ${token}`
         }
       }
       )
       .then((response) => {
        console.log(response.data)
        setName(response.data.data.firstName + " " + response.data.data.lastName)
        setImageLink(response.data.data.profilePic)
        setUserFound(true)
       })
       .catch((error) => {
         console.error(error);
       });
  } else {
    setName("")
    setImageLink("")
  }

 },
 //dependencies array
 [userFound]
)

//logout
const handleLogout = () => {
  localStorage.removeItem('token');
  setUserFound(false)
  
}
 


  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <img className='rounded-full w-10 h-10' src={imageLink} style={{width:"50px",height:"50px"}} alt="" />
      <h1 className='text-lg font-bold '>{name} </h1>


      <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        
        
        Logout</button>
    </div>
  )
}                                                                       

export default UserTag
