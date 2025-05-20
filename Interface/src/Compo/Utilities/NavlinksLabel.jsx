import React from 'react'
import { Link } from 'react-router'

const NavlinksLabel = ({Icon, label, linkobj}) => {
  return (
    <Link to={linkobj} className='inline-block lg:flex lg:mx-10 items-center lg:gap-5 text-white'>
        
        <span className=''><Icon /></span>
        <span className='hidden lg:inline'>{label}</span>
    </Link>
  )
}

export default NavlinksLabel