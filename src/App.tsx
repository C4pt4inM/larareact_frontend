import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';


interface AttendanceData {
  id: number;
  employee: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
  };
  schedule: null ; // Assuming ScheduleData is the type for schedule object
  check_in_time: string;
  check_out_time: string;
  hours: number;
  created_at: string;
  updated_at: string;
}


interface Challenge2Data {
  success: boolean;
  result: {
    [key: string]: number;
  }[];
  image: any
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}


function App() {

  const [loading, setLoading] = useState(true);
  const [nodata, setNodata] = useState(false);
  const [chal2, setChal2] = useState<Challenge2Data | null>(null);


  const [attendance, setAttendance] = useState<AttendanceData[]>();

  const fetchAtt = async () => {
    let attCall =  await fetch(process.env.REACT_APP_API_URL + '/attendance')
    let attResult = await attCall.json();

    // console.log(attResult)
    if(attResult.length > 0) {
      setAttendance(attResult)
    }  
    else {
      setNodata(true)
    }
    setLoading(false)
  }

  const fetchChallenge2 = async () => {
    let apiCall =  await fetch(process.env.REACT_APP_API_URL + '/challenge2')
    let apiResult = await apiCall.json()
    console.log(apiResult);
    setChal2(apiResult);
  }

  useEffect(() => {
   

    fetchAtt()
    fetchChallenge2()

  }, [])



  
  const handleTab = (challid: number) => {
    document.querySelectorAll('div.challenge-card').forEach(function(k,v) {
      let itemID = "challenge-card"+challid;
      if(k.id == itemID) {
        // console.log(k.id, itemID, k.id == itemID)
        k.classList.remove('hidden')
      }
      else {
        k.classList.add('hidden')
      }
    })
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
  
    if (!file) {
      return;
    }
  
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      alert('File size exceeds the maximum limit of 10MB.');
      return;
    }
  
    if (!file.name.endsWith('.xlsx')) {
      alert('Invalid file format. Only XLSX files are allowed.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    
    setAttendance([]);
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + '/uploadExcel', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('File uploaded successfully');
          fetchAtt()

        } else {
          alert('Error in uploading File')
        }
      })
      .catch((error) => {
        alert('Error in uploading File')
        console.error('File upload failed:', error);
      });
  };

  return (
    <div className="App max-w-6xl mx-auto my-12">
      <div className="navigation">
          <ul className="flex max-w-xl justify-center gap-4 mx-auto">
            <li><button onClick={() => handleTab(1)} className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400" type="button" id="challenge1">Challenge 1</button></li>
            <li><button onClick={() => handleTab(2)} className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400" type="button" id="challenge2">Challenge 2</button></li>
          </ul>
      </div>
      <div id="challenge-card1" className="challenge-card shadow-lg rounded-lg p-4 my-12 border border-gray-200 ">
        <h1 className="text-4xl font-bold">Attendance</h1>
        <div>
          Upload new File: <input type="file" onChange={handleFileChange}/>
        </div>
        <div className="table w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className='font-bold border-b-2 border-gray-300'>Employee ID</th>
                <th className='font-bold border-b-2 border-gray-300'>Check In Time</th>
                <th className='font-bold border-b-2 border-gray-300'>Check out Time</th>
                <th className='font-bold border-b-2 border-gray-300'>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              
              { loading  ? 
                    <tr><td colSpan={4}> Loading ...</td></tr>
                : 
                 
                  attendance?.map((k,v) => (
                    <tr key={v+"_"+k.id+k.hours}>
                      <td className='border-b border-gray-200'>{k.employee?.name}</td>
                      <td className='border-b border-gray-200'>{k.check_in_time ? formatDate(k.check_in_time) : 'N/A'}</td>
                      <td className='border-b border-gray-200'>{k.check_out_time? formatDate(k.check_out_time) : 'N/A'}</td>
                      <td className='border-b border-gray-200'>{k.hours}</td>
                    </tr>
                  ))
             }
             { 
              !loading && nodata && <tr><td colSpan={4}> No data found</td></tr>
             }
            </tbody>
          </table>
        </div>
      </div>
      <div id="challenge-card2" className="challenge-card shadow-lg rounded-lg p-4 my-12 border border-gray-200 hidden">
        <h1 className="text-4xl font-bold">Array size and Item Count</h1>
        <div className="rounded-lg border border-gray-200 p-2">
          <label htmlFor="" className="font-bold">Input Arrays</label>
             { chal2 && <img src={chal2?.image } /> }

            <h3 className="text-2xl font-bold">
              Array items with there number of appearance in an array
            </h3>
             <div className="grid grid-cols-5">
             {chal2 && chal2.result.map((obj, index) => (
              <div key={index} className="border-y">
                {Object.entries(obj).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ))}
              </div>
            ))}
             </div>
        </div>
      </div>
    </div>
  );
}

export default App;
