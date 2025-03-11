import { React, useState, useEffect } from 'react';
import "./Buy2.css";
import { useLocation } from "react-router-dom";
import test from '../../Assets/test.png';
import fullview from '../../Assets/fullview.jpg'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';


const Buy2 = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];
  const mapContainerStyle = {
    width: '700px',
    height: '400px',
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${apiKey}`,
    libraries,
  });
 
  const location = useLocation();
  const data = location.state;
  const image = data.image_urls_array;
  const [currentPage, setCurrentPage] = useState(1);

  const imageSet = (number)=>{
      console.log(image)
      return image[number-1]
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  //fetch information of plot with the data
  const [selectedImage, setSelectedImage] = useState(test);
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const buttons = ["Hospital", "School", "Restaurant","Supermarket","Police Station","Gym","Park","Bank"];
  const [selectedButton, setSelectedButton] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const handleSavedButton = async()=>{
    const temp = {property_id:data.property_id,user_id:data.user_id}
    try{
        const result = await axios.post('http://localhost:3001/properties/saved',temp)
        const result2 = result.data
        if(result2.status=="Already saved"){
          window.alert("Already saved")
          return
        }
        else{
          window.alert("Saved for later")
        }
    }catch(error){
        console.log("error")
    }
  }


  useEffect(() => {
    if (isLoaded && selectedButton) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      service.nearbySearch({
        location: { lat: data.latitude, lng: data.longitude  },
        radius: 10000, // Adjust radius as needed
        type: selectedButton.toLowerCase(),
      }, (results, status) => {
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setNearbyPlaces(results);
        }
      });
    }
  }, [isLoaded, selectedButton]);
  

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className='buy2-outer-container'>
      <div className='buy2-inner-container'>
        <div className='buy2-images'>
            <div className='buy2-images-upper'>
                <div className="buy2-images-upper-image">
                    <img src={imageSet(currentPage  )} alt='no image'/>
                    
                </div>
            </div>
            <div className='buy2-images-lower'>
              <div className='buy2-images-lower-left'>
                <Pagination count={image.length} onChange={handlePageChange} />
              </div>
              <div className='buy2-images-lower-right'>
                  <img src={fullview} className='full-view-image'/>
              </div>
                
            </div>
        </div><br />
        <div className='details-heading'>
          <span>Details</span>
        </div>
        <div className='line'></div>
        <div className='details'>
        <div className='details-left'>
                  <div className='details-text'>
                    <span style={{ color: 'red' }} >Owner Name :</span> <sp className='details-text'>{data.user_name}</sp><br/>
                  </div>
                  <div className='details-text'>
                    <span style={{ color: 'red' }} >Area :</span> <sp className='details-text'>{data.area} sqft</sp><br/>
                  </div>
                  <div className='details-text'>
                    <span style={{ color: 'red' }} >Price :</span> <sp className='details-text'>₹ {data.price}</sp><br/>
                  </div>
                  <div className='details-text'>
                    <span style={{ color: 'red' }} >Contact number :</span> <sp className='details-text'>{data.phone_no}</sp><br/>
                  </div>
                </div>
                <div className='details-right'>
                  <div className='details-text'>
                      <span style={{ color: 'red' }} >District :</span> <sp className='details-text'>{data.district}</sp><br/>
                  </div>
                  <div className='details-text'>
                      <span style={{ color: 'red' }} >City :</span> <sp className='details-text'>{data.city}</sp><br/>
                  </div>
                  <div className='details-text'>
                      <span style={{ color: 'red' }} >Town :</span> <sp className='details-text'>{data.town}</sp><br/>
                  </div>
                  <div className='details-text'>
                      <span style={{ color: 'red' }} >Email :</span> <sp className='details-text'>{data.email_id}</sp><br/>
                  </div>
                </div>
        </div>
        <div className='details-heading'>
          <span>Amneties</span>
        </div>
        <div className='line'></div>
        <div className='amneties-container'>
          
          <div className='amneties-map'>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14} 
              center={{ lat: data.latitude, lng: data.longitude }}
            >
              <Marker
                position={{ lat: data.latitude, lng: data.longitude }}
                title="Center"
                key={Math.random()}
              />
              
              {nearbyPlaces.map((place, index) => (
                <Marker
                  key={index}
                  position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
                  title={place.name}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                />
              ))}
            </GoogleMap>
          </div>
          <div className="button-row">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`custom-button ${selectedButton === button ? 'black' : ''}`}
                onClick={() => handleButtonClick(button)}
              >
                {button}
              </button>
            ))}
          </div>
        </div>
        <div className='details-heading'>
          <span>Description</span>
        </div>
        <div className='line'></div>
        <div className='plot-description'>
         {data.description}
        </div>
        <div className='saved-button-class'>
          <input type="submit" value="Save for later" name="saved" class="saved-button" onClick={handleSavedButton}/>
        </div>
      </div>
    </div>
  );
};

export default Buy2;
