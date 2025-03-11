import React,{ useState } from 'react'
import "./Register.css"
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = () => {
  const [inputs , setInputs] = useState({
    user_name:"",
    email_id:"",
    phone_no:"",
    password:"",
    confirm_password:""
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
    if(newRecord.password!=newRecord.confirm_password){
      alert("Incorrect password");
      return; 
    }
    try {
			  const data = await axios.post('http://localhost:3001/users/register',newRecord);
			  const temp = data.data
        if(temp.status == "already exists"){
          alert("User already exists");
        }
        else{
          alert("Successfully registered account")
          navigate("/")
        }
		  } catch (error) {
			  console.log(error);
		  }
    
  }

  return (
    <div className='register-container'>
      <div className='register-inner-container'>
        <div className="register-heading">
          <sp>Register new account</sp>
        </div>
        <div className='register-input-container'>
          <input className='register-input' name='user_name'  type='text' placeholder='Enter Your Name' onChange={handleInput} value={inputs.user_name}/><br/>
          <input className='register-input' name='email_id'  type='text' placeholder='Enter Your Emai Id' onChange={handleInput} value={inputs.email_id}/><br/>
          <input className='register-input' name='phone_no'  type='number' placeholder='Enter Your Number' onChange={handleInput} value={inputs.phone_no}/><br/>
          <input className='register-input' name='password'  type='password' placeholder='Enter Password' onChange={handleInput} value={inputs.password}/><br/>
          <input className='register-input' name='confirm_password'  type='password' placeholder='Confirm Password' onChange={handleInput} value={inputs.confirm_password}/><br/>
        </div>
        <button type="submit" className='register-submit-button' onClick={handleSubmit} >Register</button>   
      </div>
    </div>
  )
}

export default Register
