import React, { useState } from 'react';
import Datepicker from "react-tailwindcss-datepicker";
const EditTime = ({ settime }) => {

  const [value, setValue] = useState({ 
    startDate: null,
    endDate: null 
    }); 
    
    const handleValueChange = (newValue) => {
    console.log("newValue:", newValue); 
    setValue(newValue); 
    } 
    
  const handleSubmit = () => {
    // Perform submit logic here
    console.log('New Project Date:', value);
    //db part 
    settime(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Change Project Date</h2>
          <Datepicker 
value={value} 
onChange={handleValueChange} 
showShortcuts={true} 
/>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-indigo-600"
            >
              Save
            </button>
            <button
              onClick={()=>{
                settime(false)
              }}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTime;
