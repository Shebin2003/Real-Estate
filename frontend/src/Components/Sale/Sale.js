import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import "./Sale.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Sale = () => {
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = year + "/" + month + "/" + date;

  const user_id = localStorage.getItem('user_id')
  const [selectedFiles, setSelectedFiles] = useState([]); // State to store the selected files
  const [imageUrls, setImageUrls] = useState([]); // State to store the uploaded image URLs
  const [inputs, setInputs] = useState({
    district: "Thiruvananthapuram",
    city: "",
    town: "",
    price: "",
    area: "",
    description: "",
    posted_on: currentDate,
    user_id: user_id,
  })
  const mapContainerStyle = {
    width: '1150px',
    height: '700px',
  };
  const keralaBounds = {
    north: 12.794,
    south: 7.992,
    west: 74.789,
    east: 77.054,
  };
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${apiKey}`,
    libraries,
  });

  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLon = event.latLng.lng();
    setMarker({ lat: clickedLat, lng: clickedLon });
    if (!isLocationInKerala(clickedLat, clickedLon)) {
      alert('Selected place is outside of Kerala');
      return;
    }
    console.log('Clicked location:', { lat: clickedLat, lng: clickedLon });
    setLat(clickedLat);
    setLon(clickedLon);
  };

  const handleSearch = async () => {
    if (searchCity.trim() !== '') {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchCity}&key=${apiKey}`);
        const data = await response.json();
        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          if (!isLocationInKerala(location.lat, location.lng)) {
            alert('Selected place is outside of Kerala');
            return;
          }
          setLat(location.lat);
          setLon(location.lng);
          setMarker({ lat: location.lat, lng: location.lng });
          console.log('Searched location:', { lat: location.lat, lng: location.lng });
        } else {
          console.log('City not found');
        }
      } catch (error) {
        console.error('Error searching for city:', error);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      if (!isLocationInKerala(currentLat, currentLon)) {
        alert('Selected place is outside of Kerala');
        return;
      }
      setLat(currentLat);
      setLon(currentLon);
      setMarker({ lat: currentLat, lng: currentLon });
      console.log('Current location:', { lat: currentLat, lng: currentLon });
    });
  };


  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs({ ...inputs, [name]: value })
  }
  const district = ["Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"]
  const handleDistrictChange = event => {
    setInputs({ ...inputs, district: event.target.value });
  };

  const isLocationInKerala = (latitude, longitude) => {
    return latitude >= keralaBounds.south && latitude <= keralaBounds.north &&
      longitude >= keralaBounds.west && longitude <= keralaBounds.east;
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    setInputs((prevInputs) => ({
      ...prevInputs,
      latitude: lat,
      longitude: lon,
    }));
  
    if (selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }
    if (selectedFiles.length > 4) {
      alert('Only 4 photos can be uploaded.');
      return;
    }
    // Checking if all fields are filled
    for (const key in inputs) {
      if (inputs[key] == "") {
        alert("All fields are required");
        return;
      }
    }
    try {
      const promises = selectedFiles.map(async (file) => {
        const randomNumber = Math.floor(Math.random() * 1000000);
        // Get the file extension
        const fileExtension = file.name.split('.').pop();
        // Construct the new file name with the random number and the original file extension
        const newFileName = `${randomNumber}.${fileExtension}`;
        
        const { data, error } = await supabase.storage
          .from('shebin_bucket')
          .upload(`mini-project/${newFileName}`, file);
      
        if (error) {
          throw error;
        }
        return `${supabaseUrl}/storage/v1/object/public/shebin_bucket/mini-project/${newFileName}`;
      });
  
      const uploadedImageUrls = await Promise.all(promises);
      console.log('Image URLs:', uploadedImageUrls);
      await setImageUrls(uploadedImageUrls); // Await the setImageUrls function
    
      // Now that imageUrls is updated, proceed with further operations
      const newRecord = { ...inputs, latitude: lat, longitude: lon, image_urls: uploadedImageUrls, no_of_images: selectedFiles.length };
      console.log("New record before submission:", newRecord);
      

      //Checking if logged in or not
      if (user_id) {
        try {
          await axios.post('http://localhost:3001/properties/sell', newRecord);
          window.alert("Successfully added for sale")
          navigate('/')
        }
        catch (error) {
          console.log("error")
        }
      }
      else {
        window.alert("You are not logged in")
        console.log("Newrecord", newRecord);
      }
    } catch (error) {
      console.error('Error uploading images:', error.message);
      alert('Failed to upload images.');
    }
  };
  


  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files)); // Convert FileList to array
  };

  return (
    <div className='sale-container'>
      <div className='sale-inner-container'>
        <div className="enter-details">
          <sp>Enter details of your plot</sp>
        </div>
        <div className='map-container'>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={{ lat: lat, lng: lon }}
            onClick={handleMapClick}
          >
            {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
          </GoogleMap>
        </div>
        <div className='search-container'>
          <Autocomplete
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={() => {
              if (autocomplete) {
                const place = autocomplete.getPlace();
                setSearchCity(place.formatted_address);
              }
            }}
          >
            <input
              type='text'
              placeholder='Enter location'
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className='place-search'
            />
          </Autocomplete>
        </div>
        <div>
          <button onClick={handleSearch} className='search-button1'>Search</button>
          <button onClick={handleUseCurrentLocation} className='search-button2' >Use Current Location</button>
        </div>
        <div className='input-data-container'>
          <div className='input-data-container-left'>
            <sp className="city-select">City</sp>
            <br />
            <input className='input-data-container-left-inputs' name='city' type='text' placeholder='Enter Your city' onChange={handleInput} value={inputs.city} /><br /><br />
            <br /><br />
            <sp className="city-select">District</sp>
            <select className='district-select' onChange={handleDistrictChange}>
              {district.map((option, index) => (
                <option name='district' key={index} value={option}>{option}</option>
              ))}
            </select>
            <br /><br /><br /><br />
            <sp className="city-select">Price</sp>
            <br />
            <input className='input-data-container-left-inputs' name='price' type='number' placeholder='Enter Your price per cent' onChange={handleInput} value={inputs.price} />

          </div>
          <div className='input-data-container-right'>
            <sp className="city-select">Town</sp>
            <br />
            <input className='input-data-container-left-inputs' name='town' type='text' placeholder='Enter Your town' onChange={handleInput} value={inputs.town} /><br /><br />
            <br /><br />
            <sp className="city-select">Area</sp>
            <br />
            <input className='input-data-container-left-inputs' name='area' type='text' placeholder='Enter area in cents' onChange={handleInput} value={inputs.area} /><br /><br />
            <form><br /><br />
              <sp className="city-select">Upload Images of Plot</sp><br /><br />
              
              <input type="file" className='choose-image' onChange={handleFileChange} multiple /> {/* Allow multiple file selection */}
              <br/>
              <div className='image-warning'>
              <sp className="image-warning-text">(square images are recommended)</sp>
              </div>
            </form>
            
          </div>
        </div><br /><br /><br /><br /><br /><br />
        <div className='description-container'>
          <sp className="description-heading">Any words on your plot</sp>
          <br />
          <input className='description-input' name='description' type='text' onChange={handleInput} value={inputs.description} /><br /><br />
        </div>
        <button type="submit" className='sale-submit-button' onClick={handleSubmit} >Submit</button>
      </div>
    </div>
  );
}

export default Sale;
