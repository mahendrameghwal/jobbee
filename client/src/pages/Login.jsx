import { useNavigate } from "react-router-dom";
import emailicon from "../assets/email.svg";
import lock from "../assets/lock.svg";
import { useDispatch, useSelector } from "react-redux";
import { SetLoginUser, resetuser } from "../../app/slices/Loginslice";
import { useCallback, useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import {toast} from "react-hot-toast";
import { useLoginMutation } from "../../app/api/authApi";


const Login = () => {
  const [login, { isLoading, error }] = useLoginMutation();

  const [Showpassword, setShowpassword] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const User = useSelector(state => state.login.User);
  const dispatch = useDispatch();
  const { email, password } = User;


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await login(User).unwrap();
    if (response?.token) {
      setTimeout(() => {
        dispatch(resetuser());
      }, 2000);
      response.message && toast.success(response.message);
      navigate('/');
    }
  } catch (error) {
    if (error?.data?.details) {
      toast.error('Please fill in all required fields before submitting');
    } else {
      error.data.message && toast.error(error.data.message);
    }
  }
  
};


const HandleUser = e => {
  const { name, value } = e.target;
  dispatch(SetLoginUser({ [name]: value }));
}

 


  return (
    <div className="min-h-screen max-h-full">

      <div className="h-screen md:flex">
        <div className="relative -z-10 overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
          <div>
            <h1 className="text-white font-bold text-4xl font-sans">JobBee</h1>
            <p className="text-white mt-1">Looking for a New Job?</p>
            <button className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">
              Read More
            </button>
          </div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <form
          onSubmit={handleLogin}
          className="flex  max-md:flex max-md:items-center max-md:h-screen md:w-1/2 justify-center py-10 items-center bg-white"
        >
          <div className=" max-md:w-2/3 w-1/2">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hello Again!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Welcome Back
            </p>
            <div className={`flex items-center border-2 py-2 px-3  rounded-md mb-4`}>
              <img className="h-5" src={emailicon} alt="email" />

              <input
                value={email}
                onChange={HandleUser}
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="email"
                placeholder="Email Address"
              />
          
              
              
              </div>
          
            <div className={`flex relative items-center border-2 py-2 px-3 rounded-md mb-4`}>
              <img className="h-5" src={lock} alt="" />
              {Showpassword ? (
                <BiHide
                  onClick={() => {
                    setShowpassword(!Showpassword);
                  }}
                  size={20}
                  className=" right-3 absolute cursor-pointer"
                />
              ) : (
                <BiShow
                  onClick={() => {
                    setShowpassword(!Showpassword);
                  }}
                  size={20}
                  className=" right-3 absolute cursor-pointer"
                />
              )}
              <input
                value={password}
                onChange={HandleUser}
                className="pl-2 outline-none border-none w-full"
                type={Showpassword ? "text" : "password"}
                name="password"
                placeholder="Password"
              />
            </div>

            <button
            disabled={isLoading}
              onClick={handleLogin}
              type="submit"
              className="block w-full hover:bg-indigo-600 transition-colors bg-indigo-500 mt-4 py-2 rounded-md text-white max-md:text-sm tracking-wider font-medium mb-2"
            >
              {isLoading ?'scanning data..':'Login'}
            </button>
            <button type="button" role="button"
              onClick={() => {
                navigate("/register");
              }}
           
              className="block w-full hover:bg-indigo-600 transition-colors bg-indigo-500 mt-4 py-2 rounded-md text-white max-md:text-sm tracking-wider font-medium mb-2"
            >
              Register 
            </button>

            <button type="button" role="button"
              onClick={() => {
                navigate("/forgotpassword");
              }}
              className="text-sm ml-2 underline text-blue-500 cursor-pointer"
            >
              Forgot Password ?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
// ${ErrorMessages && ErrorMessages.password ? 'mb-2':'mb-4'}