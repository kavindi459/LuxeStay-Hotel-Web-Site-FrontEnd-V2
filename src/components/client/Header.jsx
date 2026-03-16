import Logo from './../../assets/logo.png'
import UserTag from './UserTag'

const Header = () => { 
  return (
    <header className='flex justify-between items-center bg-white/10 backdrop-blur-md p-4 '>
        <img className='w-15 h-15' src={Logo} alt="" />
        <UserTag />
        
    </header>
  )
}

export default Header
