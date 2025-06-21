import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4 md:px-12'>
      <img
        onClick={() => navigate('/')}
        className='h-10 w-auto cursor-pointer'
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-primary text-primary py-1'
              : 'py-1 hover:text-primary transition-colors'
          }
        >
          <li>HOME</li>
        </NavLink>

        <NavLink
          to='/doctors'
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-primary text-primary py-1'
              : 'py-1 hover:text-primary transition-colors'
          }
        >
          <li>ALL DOCTORS</li>
        </NavLink>

        <NavLink
          to='/about'
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-primary text-primary py-1'
              : 'py-1 hover:text-primary transition-colors'
          }
        >
          <li>ABOUT</li>
        </NavLink>

        <NavLink
          to='/contact'
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-primary text-primary py-1'
              : 'py-1 hover:text-primary transition-colors'
          }
        >
          <li>CONTACT</li>
        </NavLink>
      </ul>


      <div className='flex items-center gap-4'>
        {token && userData ? (
          <>
            {/* Profile Dropdown (Desktop) */}
            <div className='relative group hidden md:flex items-center gap-2 cursor-pointer'>
              <img className='w-8 h-8 rounded-full object-cover' src={userData.image} alt="Profile" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logOut} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>

            {/* Hamburger Icon (Mobile) */}
            <img
              onClick={() => setShowMenu(true)}
              className='w-6 md:hidden'
              src={assets.menu_icon}
              alt="Menu"
            />
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-primary text-white px-6 py-2 rounded-full font-light'
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className='fixed inset-0 bg-black bg-opacity-40 z-30' onClick={() => setShowMenu(false)}>
          <div
            className='absolute top-0 right-0 w-3/4 max-w-sm bg-white h-full p-6 shadow-lg flex flex-col gap-6 z-40'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center'>
              <img
                className='w-32 cursor-pointer'
                src={assets.logo}
                onClick={() => {
                  navigate('/');
                  setShowMenu(false);
                }}
                alt="Logo"
              />
              <img
                className='w-5 cursor-pointer'
                src={assets.cross_icon}
                onClick={() => setShowMenu(false)}
                alt="Close"
              />
            </div>

            <nav className='flex flex-col gap-4 text-gray-700 font-medium'>
              <NavLink to='/' onClick={() => setShowMenu(false)}>HOME</NavLink>
              <NavLink to='/doctors' onClick={() => setShowMenu(false)}>ALL DOCTORS</NavLink>
              <NavLink to='/about' onClick={() => setShowMenu(false)}>ABOUT</NavLink>
              <NavLink to='/contact' onClick={() => setShowMenu(false)}>CONTACT</NavLink>

              {/* Authenticated Mobile Links */}
              {token && userData && (
                <>
                  <hr />
                  <NavLink to='/my-profile' onClick={() => setShowMenu(false)}>My Profile</NavLink>
                  <NavLink to='/my-appointments' onClick={() => setShowMenu(false)}>My Appointments</NavLink>
                  <p onClick={() => { logOut(); setShowMenu(false); }} className='cursor-pointer'>Logout</p>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
