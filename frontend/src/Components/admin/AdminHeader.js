import React, { useState, useEffect } from 'react';
import homelogo2 from '../../Assets/homelogo2.png'
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate()

  function refreshPage() {
    localStorage.clear()
    navigate('/')
    window.location.reload(false);
  }

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const admin_id = localStorage.getItem('admin_id');
    if (!admin_id) {
      window.alert("Not logged in as admin")
      navigate('/adminlogin')
    } 
  }, []); // Empty dependency array to run effect only once on component mount

  const handleClick = (event) => {
    navigate('/viewusers')
  };

  return (
    <div className='header-container'>
        <div className='header-upper-container'>
            <div className='header-image' onClick={refreshPage}>
              <img src={homelogo2} style={{ width: '250px', height: 'auto' }} />
            </div>
        </div>
        <div className='header-text' >
              <div className='account-dropdown-container'>
                <sp className='account-dropdown' onClick={handleClick}>Admin</sp>
            </div>
        
        </div>
    </div>
  )
}

export default AdminHeader
