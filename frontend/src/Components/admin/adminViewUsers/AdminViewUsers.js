import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminViewUsers.css'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

const AdminViewUsers = () => {
  const [users,setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    async function fetchdata(){
      try {
        const temp = await axios.get(`http://localhost:3001/admin/fetchusers`);
        setUsers(temp.data);
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchdata()
  },[])

  const columns = [
    { field: 'user_name', headerName: 'User name', width: 330 },
    { field: 'phone_no', headerName: 'Phone no', width: 180 },
    { field: 'email_id', headerName: 'Email Id', width: 330 },
  ]

 const onClick = (row)=>{
    navigate('/viewproperties',{state:row.row})
 }

  return (
    <div className='viewusers-container'>
        <div className='viewuser-heading'>
            <h1>Registered Users</h1>
        </div>
        <div className='users-list-table'>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            onRowClick={onClick}
        />
        </div>
    </div>
  )
}

export default AdminViewUsers
