import React, {  useCallback, useEffect, useState  } from "react";
import rightarrow from "../../assets/rightarrow.svg"
import toast from 'react-hot-toast';
import OrgCategories from "../../data/OrgCategory";
import {  SetOrgdata, setCountry,setState,setCity,resetForm } from "../../../app/slices/CreateOrgSlice" ;
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { Fragment } from "react";
import {loadCities,loadCountries,loadStates} from '../../../app/slices/AddressSlice';
import { v4 as uuidv4 } from 'uuid';
import {useCreateorgMutation} from "../../../app/api/OrgApi"

const CreateCompany = React.memo(() => {
  const Org = useSelector((state) => state.CreateOrg.formData)
  const address = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [createorg, {isError,error}] = useCreateorgMutation();
  const [fileInputState, setFileInputState] = useState();
  const [previewSource, setPreviewSource] = useState('');
  
  useEffect(() => {
    dispatch(loadCountries());
  }, []);

  


   const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    previewFile(file);
    setFileInputState(e.target.value);
  },[]);

 
  

const previewFile = useCallback((file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
      setPreviewSource(reader.result);
      dispatch(SetOrgdata({ avtar:reader.result }));
  };
},[]);



const handleSubmit = useCallback(async (event) => {
  event.preventDefault();
  const {data,error} = await createorg(Org); 
  if (data) {
   toast.success('Successfully created Your profile');
   dispatch(resetForm())
   setPreviewSource(""),
   setFileInputState('')
   dispatch(SetOrgdata({ avtar:'' }));
 } else if (error) {
  console.log(error);
  error.data.error && 
  toast.error(error.data.error) || 
  error.data.message && 
  toast.error(error.data.message)||
  toast.error('something went wrong')
 }
},[createorg, Org]);


 console.log(Org);

  const HandleCountry = useCallback((country) => {
    if (country) {
      dispatch(setCountry(country));
      const countryObj = address.countries.find((countryObj) => countryObj.name === country);
      if (countryObj) {
        dispatch(loadStates(countryObj.isoCode));
        dispatch(loadCities(countryObj.isoCode));
      }
    }
  }, [dispatch, address.countries]);




  const handleChange =useCallback((e) => {
    const { name, value } = e.target;
     dispatch(SetOrgdata({ [name]: value }));
   },[]);

  const ClosePreview =()=>{
  setPreviewSource(""), setFileInputState('')
  dispatch(SetOrgdata({ avtar:'' }));
  }
 

const countryloading = address.countries.length === 0;
const stateloading = address.states.length === 0;
const cityloading = address.cities.length === 0;
const [visibleCities, setVisibleCities] = useState(500); 
const totalCities = address.cities.length;
const remainingCities = totalCities - visibleCities;
const showLoadMore = remainingCities > 0;

  return (
    <div className="min-h-screen w-11/12 mx-auto shadow-2xl max-h-full border my-2">
      <p className="bg-gradient-to-t  from-green-500 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent text-center my-7 max-md:text-xl">Fill some Detail for Your organization</p>
      <div className="  px-2 ">
      <div className="p-3">
      {
        previewSource && 
       <Fragment>
       <p className= " bg-gradient-to-t from-green-500 via-blue-600 to-purple-500 bg-clip-text text-sm font-bold text-transparent">Profile Image</p>
       <div className="relative my-3">
       <IoMdClose onClick={ClosePreview} className="absolute cursor-pointer -top-2 " size={20}/>
       <img className=" h-20 w-20 border border-gray-300 p-0.5 object-contain rounded-full shadow-lg shadow-gray-400" src={previewSource}  alt="img"  />
       </div> 
       </Fragment>
       
      }
      
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-6">
        {/*avtar */}
        <div className="w-1/2 max-md:w-full  mb-3 md:mb-0">
        <label htmlFor="avtar" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Logo
        </label>
        <input  name="avtar" 
               type="file" multiple
               onChange={handleFileInputChange}
                    value={fileInputState}
                    accept=".jpg,.jpeg,.png, image/jpeg ,image/png"
                    className="appearance-none cursor-pointer block w-full max-md:placeholder:text-sm   bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"/>
                  
    
      
        </div>
     
          <div className="w-1/2 max-md:w-full px-3 max-md:px-0 mb-3 md:mb-0">
            <label htmlFor="orgname" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Name <span className=" text-red-500  text-sm italic ">*</span>
            </label>
            <input name="orgname"  onChange={handleChange} value={Org.orgname}
              className="appearance-none  max-md:placeholder:text-sm  block w-full  bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Company name"
            />
            
            {isError && error?.data?.details?.orgname && (
              <p className="text-red-500 text-xs mt-1">{error.data.details.orgname}</p>
            )}
     
          </div>

        

      
          <div className="w-1/2 max-md:w-full my-2 md:mb-0">
            <label htmlFor="category" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Category <span className=" text-red-500  text-sm italic ">*</span>
            </label>
            <select required    onChange={handleChange} value={Org.category }      className="focus:ring-1 ring-blue-500 rounded-md outline-none border placeholder:text-gray-400 border-gray-300 bg-slate-100 max-md:px-2  px-4 py-3 w-full" name="category" id="">
            <option value='' disabled>Select a Category</option>
            {OrgCategories.map((types) => (
              <option key={types.id} value={types.name}>
                {types.name}
              </option>
            ))}
     
     </select>
      
     {isError && error?.data?.details?.category && (
      <p className="text-red-500 text-xs mt-1">{error.data.details.category }</p>
    )}
        
          </div>

         
          <div className="w-1/2 max-md:w-full px-3 max-md:px-0 my-2 md:mb-0">
          <label htmlFor="linkedin" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Linkdin
          </label>
          <input name="linkedin" onChange={handleChange} value={Org.linkedin}
            className="appearance-none max-md:placeholder:text-sm  block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-city"
            type="text"
            placeholder="https://www.linkedin.com/in/company-name/"
          />
        
        </div>


      
        <div className="w-1/2 max-md:w-full  my-3 md:mb-0">
        <label htmlFor="website" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          website
        </label>
        <input name="website" onChange={handleChange} value={Org.website}
          className="appearance-none max-md:placeholder:text-sm  block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-city"
          type="text"
          placeholder="https://www.your-site-name.com/"
        />
       
      </div>

 
      <div className="w-1/2 max-md:w-full px-3 max-md:px-0 my-2 md:mb-0">
  <label htmlFor="mobile" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  Mobile no. <span className=" text-red-500  text-sm italic ">*</span>
  </label>
  <input name="mobile" onChange={handleChange} value={Org.mobile}
    className="appearance-none max-md:placeholder:text-sm  block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
  
    type="text"
    placeholder="+91 1234567890"
  />

  {isError && error?.data?.details?.mobile && (
    <p className="text-red-500 text-xs mt-1">{error.data.details.mobile }</p>
  )}

</div>

<div className='flex w-full max-md:my-1.5 max-md:flex-col my-3 justify-between gap-x-4'>
       


<div className="w-1/3 max-md:w-full my-2 md:mb-0">
<label htmlFor='country' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  Country
</label>
<select
  name='country'
  value={Org.country}
  onChange={(e) => HandleCountry(e.target.value)}
  className="max-md:placeholder:text-sm block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
  disabled={countryloading}
>
  <option className='!text-sm' value=''>
    {countryloading ? 'Loading countries...' : 'Select a country'}
  </option>
  {!countryloading &&  address.countries.map((country,i) => (
      <option key={`${country.name}-${uuidv4()}`} value={country.name}>{country.name}</option>
    ))}
</select>
</div>





<div className="w-1/3 max-md:w-full my-2 md:mb-0">
<label htmlFor='state' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
state
</label>
  <select name='state'  value={Org.state} onChange={(e) =>dispatch(setState(e.target.value))}
  className="max-md:placeholder:text-sm  block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
   disabled={stateloading}
  >
  <option  className='!text-sm' value=''>Select a State</option>

  {!stateloading &&
    address.states.map((state) => (
      <option key={`${state.name}-${uuidv4()}`} value={state.name}>
        {state.name}
      </option>
    ))}

  </select>    
</div>



<div className="w-1/3 max-md:w-full my-2 md:mb-0">
  <label htmlFor='city' className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
    City
  </label>
  <select
    name="city"
    value={Org.city}
    onChange={(e) => dispatch(setCity(e.target.value))}
    className=" max-md:placeholder:text-sm block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    disabled={cityloading}
  >
    <option className='!text-sm' value="">
      Select a city
    </option>

    {!cityloading &&
      address.cities.slice(0, visibleCities).map((city, i) => (
        <option key={i} value={city.name}>
          {city.name}
        </option>
      ))} 
  </select>
  {showLoadMore && (
    <button type="button"
    className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs transition duration-200 ease-in-out hover:bg-blue-600 active:bg-blue-900 focus:outline-none"
      onClick={() => { setVisibleCities((prevVisibleCities) => prevVisibleCities + 1000) }}
    >
      Load More Cities ({remainingCities} remaining)
    </button>
  )}
</div>
  

</div> 

<div className="w-full  mb-6 md:mb-0">
          <div className="w-full ">
            <label htmlFor="about" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              About Company <span className=" text-red-500  text-sm italic ">*</span>
            </label>
            <textarea rows={6} name="about" onChange={handleChange} value={Org.about}
              className="resize-none max-md:placeholder:text-sm appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              placeholder="Intro about Your organization"
            />
          

          </div>
          {isError && error?.data?.details?.about && (
            <p className="text-red-500 text-xs mt-1">{error.data.details.about}</p>
          )}

        </div>

        <div className=" w-full mx-3 my-3 ">
        
        <button onClick={handleSubmit} type="submit"
  className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-white  active:bg-indigo-500">
  <span className="absolute -start-full transition-all group-hover:start-4">
   <img src={rightarrow} className="h-4 " alt="" />
  </span>

  <span className="text-sm font-medium transition-all group-hover:ms-4">
  Submit Information
  </span>
</button>
        
        </div>

        </div>
        </form>
      </div>
    </div>
  );
});

export default CreateCompany;





