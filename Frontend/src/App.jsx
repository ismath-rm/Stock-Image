// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from 'react-toastify';
import Login from './Pages/Login'; 
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Home from './Pages/Home';
import { store } from './Redux/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce} // Corrected syntax here
        />
        
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/auth/resetpassword/:uidb64/:token" element={<ResetPassword />} />
        </Routes>
      
      </Router>
    </Provider>
  );
}

export default App;