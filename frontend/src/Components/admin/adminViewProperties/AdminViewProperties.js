import React, { useState, useEffect } from 'react';
import './adminViewProperties.css'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const AdminViewProperties = () => {
  const [searchResult, setSearchResult] = useState([])
  const location = useLocation();
  const data = location.state;
  console.log(data)
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const admin_id = localStorage.getItem('admin_id');
        const user_id = data?.user_id; // Using optional chaining to access user_id
        if (user_id) {
          const temp = await axios.get(`http://localhost:3001/properties/myproperties/?user_id=${user_id}`);
          setSearchResult(temp.data);
        } else {
          console.log("User ID is missing in location state");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData(); 
  }, [data]); 

  const handleImage = (item) => {
    return item?.image_urls_array[0]; // Using optional chaining to access image_urls_array
  };

  const handleClick = (index) => {
    navigate('/viewpropertiedetails', { state: index });
  };

  return (
    <div className={`saved-container ${searchResult.length === 0 ? 'empty-style' : ''}`} style={{ height: searchResult.length === 0 ? '100vh' : 'auto' }}>
      <sp className="saved-results">{data?.user_name}'s properties</sp> {/* Using optional chaining */}
      <div className='saved-container'>
        {searchResult.map((item, index) => (
          <div key={index} className="box">
            <div className="saved-avatar-container">
              <div className="saved-circle-avatar">
                <span className="saved-avatar-text">{item?.user_name.charAt(0)}</span> {/* Using optional chaining */}
              </div>
              <div>
                <span className="saved-owner-text">{item?.user_name}</span><br /> {/* Using optional chaining */}
                <span className="saved-owner-posted-on">{item?.formatted_posted_on}</span> {/* Using optional chaining */}
              </div>
            </div>
            <div className='saved-buy-plot-image-container'>
              <img className="saved-buy-plot-image" src={handleImage(item)} alt='no image' />
            </div>
            <div className='saved-info-display-container'>
              <div className='saved-info-display'>
                <sp>Price : {item?.price}</sp><br /> {/* Using optional chaining */}
                <sp>Area : {item?.area} cents</sp> {/* Using optional chaining */}
              </div>
            </div>
            <input type="submit" value="View Property" name="search" className="saved-buy-page1-service-button" onClick={() => handleClick(item)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminViewProperties;
