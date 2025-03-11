import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './adminLogin.css'

const AdminLogin = () => {
  const [inputs , setInputs] = useState({
    email_id:"",
    password:"",
  })
  const navigate = useNavigate();
  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs({...inputs,[name] : value})
  }

  const handleSubmit = async(event)=>{
    event.preventDefault()
    for (const key in inputs) {
      if (inputs[key] === "") {
        alert("All fields are required");
        return; 
      }
    }
    const newRecord = {...inputs}
    // Check if password and email match
    try {
      const data = await axios.post('http://localhost:3001/admin/adminlogin',newRecord);
      const temp = data.data
      if(temp.status=="Authenticated"){
        window.alert("Admin Login successfull")
        localStorage.setItem('admin_id',temp.admin_id)
        navigate('/viewusers');
      }
      else{
        window.alert(temp.status)
      }
    } catch (error) {
      console.log(error);
    }
    
    
  }

  return (
    <div className='login-container'>
      <div className='login-inner-container'>
        <div className="login-heading">
          <sp>Login</sp>
        </div>
        <div className='login-input-container'>
          <input className='login-input' name='email_id'  type='text' placeholder='Enter Your Email' onChange={handleInput} value={inputs.email_id}/><br/>
          <input className='login-input' name='password'  type='text' placeholder='Enter Your Password' onChange={handleInput} value={inputs.password}/>
        </div>
        <button type="submit" className='login-submit-button' onClick={handleSubmit} >Login</button>   
      </div>
    </div>
  )
}

export default AdminLogin
