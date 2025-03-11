import HomePage from './Pages/HomePage'
import SalePage from './Pages/SalePage'
import BuyPage from './Pages/BuyPage'
import BuyPage2 from './Pages/BuyPage2'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import SavedPage from './Pages/SavedPage'
import MyAccountPage from './Pages/MyAccountPage'
import MyAccountPage2 from './Pages/MyAccountPage2'
import SavedPage2 from './Pages/SavedPage2'
import AdminLoginPage from './Pages/AdminLoginPage'
import AdminViewUsersPage from './Pages/AdminViewUsersPage'
import AdminViewPropertiesPage from './Pages/AdminViewPropertiesPage'
import AdminViewPropertyDetails from './Pages/AdminViewPropertyDetailsPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import UserState from './Context/UserState'

function App() {
  return (
    <UserState>
    <BrowserRouter>
      <Routes>
          <Route path='/' Component={HomePage}/>
          <Route path='/sale' Component={SalePage}/>
          <Route path='/buy' Component={BuyPage}/>
          <Route path='/buy/land' Component={BuyPage2}/>
          <Route path='/register' Component={RegisterPage}/>
          <Route path='/login' Component={LoginPage}/>
          <Route path='/saved' Component={SavedPage}/>
          <Route path='/myAccount' Component={MyAccountPage}/>
          <Route path='/saved/more' Component={SavedPage2}/>
          <Route path='/myAccount2' Component={MyAccountPage2}/>
          <Route path='/adminlogin' Component={AdminLoginPage}/>
          <Route path='/viewusers' Component={AdminViewUsersPage}/>
          <Route path='/viewproperties' Component={AdminViewPropertiesPage}/>
          <Route path='/viewpropertiedetails' Component={AdminViewPropertyDetails}/>
      </Routes>
    </BrowserRouter>
    </UserState>
  );
}

export default App;
