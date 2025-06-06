import Logo from './../assets/Logo.png'
import UserTag from './UserTag'

const Header = () => { 
  return (
    <header className='flex justify-between items-center bg-white/10 backdrop-blur-md p-4 '>
        <img className='w-15 h-15' src={Logo} alt="" />
        <UserTag imageLink="https://cdn-icons-png.flaticon.com/512/219/219983.png" name="John Doe"/>
        
    </header>
  )
}

export default Header
