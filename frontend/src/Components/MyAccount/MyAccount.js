import React, { useState, useEffect } from 'react';
import './MyAccount.css'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const MyAccount = () => {
const [searchResult,setSearchResult] = useState([])
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
        try {
            const user_id = localStorage.getItem('user_id')
            const temp = await axios.get(`http://localhost:3001/properties/myproperties/?user_id=${user_id}`);
            setSearchResult(temp.data);
            
        } catch (error) {
            console.log(error);
        }
    }
    fetchData(); // Call the fetchData function when the component mounts
}, []); // Empty dependency array ensures that this effect runs only once, on mount

const handleImage = (item)=>{
    return item.image_urls_array[0]
}

const handleClick = (index) => {
  const user_id = localStorage.getItem('user_id');
  if(user_id) {
     navigate("/MyAccount2", { state: index }); 
     console.log(index,"hi")
  } else {
      window.alert("You are not logged in");
      console.log(index,"hi")
      navigate("MyAccount2", { state: index }); // Need to delete this
  }
};

  return (
    <div className={`saved-container ${searchResult.length === 0 ? 'empty-style' : ''}`} style={{ height: searchResult.length === 0 ? '100vh' : 'auto' }}>
                <sp className="saved-results">My Properties</sp>
                <div className='saved-container'>
                    {searchResult.map((item, index) => (
                        <div key={index} className="box">
                            <div className="saved-avatar-container">
                                <div className="saved-circle-avatar">
                                    <span className="saved-avatar-text">{item.user_name.charAt(0)}</span>
                                </div>
                                <div>
                                    <span className="saved-owner-text">{item.user_name}</span><br />
                                    <span className="saved-owner-posted-on">{item.formatted_posted_on}</span>
                                </div>
                            </div>
                            <div className='saved-buy-plot-image-container'>
                                <img className="saved-buy-plot-image" src={handleImage(item)} alt='no image' />
                            </div>
                            <div className='saved-info-display-container'>
                                <div className='saved-info-display'>
                                    <sp>Price : {item.price}</sp><br />
                                    <sp>Area : {item.area} cents</sp>
                                </div>
                            </div>
                            <input type="submit" value="View Property" name="search" className="saved-buy-page1-service-button" onClick={() => handleClick(item)} />
                        </div>
                    ))}
                </div>
            </div>
  )
}

export default MyAccount;
