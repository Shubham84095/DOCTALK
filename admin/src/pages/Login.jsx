import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAtoken, backendURL } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendURL + '/api/admin/login', { email, password });

        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAtoken(data.token);
        }
        else{
          toast.error(data.message)
        }
      }
      else {
        const {data} = await axios.post(backendURL + '/api/doctor/login', {email, password})

        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          console.log(data.token)
        }
        else{
          toast.error(data.message)
        }
      } 
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={onSubmitHandler} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-gray-700">
            <span className="text-indigo-600">{state}</span> Login
          </p>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-gray-600">Email</p>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <p className="mb-1 text-gray-600">Password</p>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition duration-200"
        >
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {state === 'Admin' ? (
            <p>
              Doctor Login?{' '}
              <span
                onClick={() => setState('Doctor')}
                className="text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{' '}
              <span
                onClick={() => setState('Admin')}
                className="text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
