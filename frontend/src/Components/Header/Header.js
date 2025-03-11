import React, { useState, useEffect } from 'react';
import "./Header.css"
import homelogo2 from '../../Assets/homelogo2.png'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()
  function refreshPage() {
    navigate('/')
    window.location.reload(false);

  }
  function refreshPage() {
    navigate('/')
    window.location.reload(false);
  }

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      setOptions(['logout','My Account']);
    } else {
      setOptions(['login', 'register']);
    }
  }, []); // Empty dependency array to run effect only once on component mount

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    if(selectedOption=="login"){
      navigate("/login")
      window.location.reload(false);
    }
    else if(selectedOption=="register"){
      navigate("/register")
      window.location.reload(false);
    }
    else if(selectedOption=="My Account"){
      navigate('/myAccount')
    }
    else{
      localStorage.clear()
      navigate('/')
      window.location.reload(false);
    }
    console.log(selectedOption); 

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
                <select className='account-dropdown' defaultValue="Account" onChange={handleOptionChange}>
                    <option  value="Account" disabled={true}>Account</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                </select> 
            </div>
        
        </div>
    </div>
  )
}

export default Header
