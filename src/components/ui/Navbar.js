import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between flex-wrap bg-orange-600 p-6'>
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        <span className='font-bold text-xl tracking-tight'>Orange's Pizza</span>
      </div>
      <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
        <div className='text-sm lg:flex-grow'>
          <NavLink exact='true' to='/' className='block mt-4 lg:inline-block lg:mt-0 text-orange-300 hover:text-white mr-4'>Ventas</NavLink>
          <NavLink exact='true' to='/menu' className='block mt-4 lg:inline-block lg:mt-0 text-orange-300 hover:text-white mr-4'>Menú</NavLink>
          <NavLink exact='true' to='/pedidos' className='block mt-4 lg:inline-block lg:mt-0 text-orange-300 hover:text-white'>Pedidos</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;