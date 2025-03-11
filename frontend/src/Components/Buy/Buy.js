import React, { useState, useEffect } from 'react';
import "./Buy.css";
import test from '../../Assets/test.png';
import { useNavigate, useLocation } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";


const Buy = () => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const user = useUser();
    const [searchResult,setSearchResult] = useState([])
    const [imageUrl, setImageUrl] = useState(null);
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    //Get request to fetch data within constraints of data
    
    useEffect(() => {
        async function fetchData() {
            try {
                const temp = await axios.get(`http://localhost:3001/properties/search/?city=${data.city}&district=${data.district}&town=${data.town}`);
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
           navigate("/buy/land", { state: index }); 
        } else {
            window.alert("You are not logged in");
            navigate("/buy/land", { state: index }); // Need to delete this
        }
    };
    
    const [sortBy, setSortBy] = useState(null);
    const [inputs , setInputs] = useState({
        maximum_price:'',
        minimum_price:'',
        minimum_area:'',
        maximum_area:'',
        district:data.district,
        city:data.city,
        town:data.town,
        sort_by:""
      })
    
    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs({...inputs,[name] : value})
    }

    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    const handleSubmit = async(event)=>{
        event.preventDefault()
        const newRecord = {...inputs}
        if(parseInt(newRecord.minimum_area) > parseInt(newRecord.maximum_area)){
            window.alert("Invalid area")
            return
        }
    
        if(parseInt(newRecord.minimum_price) > parseInt(newRecord.maximum_price)){
            window.alert("Invalid Price")
            return
        }
        const temp = await axios.post('http://localhost:3001/properties/filter',newRecord)
        setSearchResult(temp.data)
        console.log(temp.data,"newRecord")
      }

    //For handling sorting 
    useEffect(() => {
        async function sort(){
            try{
                const newRecord = {...inputs}
                if(newRecord.minimum_area > newRecord.maximum_area){
                    window.alert("Invalid area")
                    return
                }
            
                if(newRecord.minimum_price > newRecord.maximum_price){
                    window.alert("Invalid Price")
                    return
                }
                if(sortBy=="price"){
                    newRecord.sort_by='price'
                    const temp = await axios.post('http://localhost:3001/properties/filter',newRecord)
                    setSearchResult(temp.data)
                }
                else if(sortBy=='area'){
                    newRecord.sort_by='area'
                    const temp = await axios.post('http://localhost:3001/properties/filter',newRecord)
                    setSearchResult(temp.data)
                }
            }catch(error){
                console.log(error);
            }
        }
        sort()
    }, [sortBy]);

    return (
        <div className={`buy-container ${searchResult.length === 0 ? 'empty-style' : ''}`} style={{ height: searchResult.length === 0 ? '100vh' : 'auto' }}>
            <div className='buy-container-left'>
                <sp className="sort-by-heading">Sort By</sp>
                <div className='sort-by'>
                    <label>
                        <input type="radio" name="option" value="option1" checked={sortBy === 'price'} onChange={() => handleSortByChange('price')} />
                        Price
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="option" value="option1" checked={sortBy === 'area'} onChange={() => handleSortByChange('area')} />
                        Area
                    </label>
                </div>
                <br /><br />
                <sp className="sort-by-heading">Filters</sp>
                <div className='filters-container'>
                    <sp className="filters-headi ng">Price</sp>
                    <div className='price'>
                        <input name='minimum_price' type='number' placeholder='Min' className='price-min' onChange={handleInput} value={inputs.minimum_price}  />
                        <br />
                        <input name='maximum_price' type='number' placeholder='Max' className='price-max' onChange={handleInput} value={inputs.maximum_price} />
                    </div><br/>
                    <sp className="filters-heading">Area</sp>
                    <div className='price'>
                        <input name='minimum_area' type='number' placeholder='Min' className='price-min' onChange={handleInput} value={inputs.minimum_area}  />
                        <br />
                        <input name='maximum_area' type='number' placeholder='Max' className='price-max' onChange={handleInput} value={inputs.maximum_area} />
                    </div>
                    <div className='filters-submit-class'>
                        <input type='submit' className='filters-submit-button' value="Apply FIlters" name="submit" onClick={handleSubmit}/>
                    </div>
                    
                </div>
            </div>
            <div className='buy-container-right'>
                <sp className="searched-results">Searched Results</sp>
                <div className='container'>
                    {searchResult.map((item, index) => (
                        <div key={index} className="box">
                            <div className="avatar-container">
                                <div className="circle-avatar">
                                    <span className="avatar-text">{item.user_name.charAt(0)}</span>
                                </div>
                                <div>
                                    <span className="owner-text">{item.user_name}</span><br />
                                    <span className="owner-posted-on">{item.formatted_posted_on}</span>
                                </div>
                            </div>
                            <div className='buy-plot-image-container'>
                                <div className="image-container">
                                    <img className="buy-plot-image" src={handleImage(item)} alt='no image' />
                                </div>
                            </div>
                            <div className='info-display-container'>
                                <div className='info-display'>
                                    <sp>Price : {item.price}</sp><br />
                                    <sp>Area : {item.area} cents</sp>
                                </div>
                            </div>
                            <input type="submit" value="View Property" name="search" className="buy-page1-service-button" onClick={() => handleClick(item)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Buy;
