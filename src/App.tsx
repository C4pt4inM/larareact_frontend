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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function App() {

  const [loading, setLoading] = useState(true);
  const [nodata, setNodata] = useState(false);

  const [attendance, setAttendance] = useState<AttendanceData[]>();

  useEffect(() => {
    console.log(process.env)
    const fetchAtt = async () => {
      let attCall =  await fetch(process.env.REACT_APP_API_URL + '/attendance')
      let attResult = await attCall.json();

      console.log(attResult)
      if(attResult.length > 0) {
        setAttendance(attResult)
      }  
      else {
        setNodata(true)
      }
      setLoading(false)
    }

    fetchAtt()

  }, [])
  
  return (
    <div className="App max-w-6xl mx-auto">
      <div className="card shadow-lg rounded-lg p-4 my-12 border border-gray-200">
        <h1 className="text-4xl font-bold">Attendance</h1>
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
                    <tr>
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
    </div>
  );
}

export default App;
