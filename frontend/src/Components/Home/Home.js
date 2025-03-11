
import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import "./Home.css"
import buy from '../../Assets/buy.png'
import saved from '../../Assets/saved.png'
import sell from '../../Assets/sell.png'

const Home = () => {
  const [inputs , setInputs] = useState({
    district:"Thiruvananthapuram",
    city:"",
    town:""
  })

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs({...inputs,[name] : value})
  }

  const handleDistrictChange = event => {
    setInputs({ ...inputs, district: event.target.value });
  };
  const navigate = useNavigate()
  const handleSubmit = async(event)=>{
    event.preventDefault()
    const newRecord = {...inputs}
    navigate("/buy",{state:newRecord})
  }
  
  const handle_buy_submit=()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling behavior
    });
  }
  const handle_sell_submit=()=>{
    navigate("/sale")
  }

  const handle_saved_submit=()=>{
    const user_id = localStorage.getItem('user_id')
    if (user_id){
      navigate("/saved")
    }
    else{
      window.alert("Not logged in")
      return
    }
    
  }

  
  const district = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"]
  return (
    <div className='home-container'>
        <div className='home-main-body'>
            <div className='home-search'>
                <div className='home-search-upper'>
                    <sp className="Find-Your-Perfect-Land">Find Your Perfect Land</sp>
                    <br/><br/>
                    <sp className="home-search-text"> District</sp>
                    <br/>
                    <select className='district-input'  onChange={handleDistrictChange}>
                      {district.map((option, index) => (
                        <option name='district' key={index} value={option}>{option}</option>
                      ))}
                    </select> 
                </div>
                <div className='home-search-lower'>
                    <div className='home-search-lower-left'><br/>
                      <sp className="home-search-text"> City</sp>
                        <br/>
                        <input className='lower-left-input' name='city'  type='text' placeholder='Enter Your city' onChange={handleInput} value={inputs.city}/>
                    </div>

                    <div className='home-search-lower-right'><br/>
                      <sp className="home-search-text"> Town</sp>
                        <br/>
                        <input className='lower-left-input' name='town'  type='text' placeholder='Enter Your Town' onChange={handleInput} value={inputs.town}/>
                       
                      
                    </div>
                
                </div>
                <div className='home-search-submit'>
                  <input type="submit" value="Search Property" name="search" class="home-search-button" onClick={handleSubmit} />
                </div>  
            </div>
        </div>
        <div className='our-services'>
            <div className="our-services-heading"><br/>
              <sp >Our Services</sp><br/>
            </div>
            <div className='our-services-box'>
                <div className='buy'>
                       <div className='inner-buy'>
                          <img className="buy-icon" src={buy} alt='error'/><br/>
                          <input type="submit" value="Buy Property" name="search" class="buy-service-button" onClick={handle_buy_submit} />
                       </div>
                </div>
                <div className='sell'>
                <div className='inner-sell'>
                          <img className="buy-icon" src={sell} alt='error'/>
                          <input type="submit" value="Sell Property" name="search" class="buy-service-button" onClick={handle_sell_submit}  />
                       </div>
                </div>
                <div className='saved'>
                <div className='inner-saved'>
                          <img className="saved-icon" src={saved} alt='error'/>
                          <input type="submit" value="Saved" name="search" class="saved-service-button" onClick={handle_saved_submit}/>
                       </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Home
