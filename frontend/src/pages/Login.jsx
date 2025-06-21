import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendURL, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const response = await axios.post(backendURL + '/api/user/register', { name, password, email });
        const data = response.data;
        console.log(data);

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Registration Successfull')
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const response = await axios.post(backendURL + '/api/user/login', { password, email });
        const data = response.data;
        console.log(data);

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged In')
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if(token){
      navigate('/')
    }
  }, [token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="flex flex-col gap-5 bg-white p-8 sm:min-w-[400px] w-full max-w-md border border-gray-200 rounded-xl shadow-xl text-zinc-600 text-sm">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm mt-1 text-gray-500">
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment.
          </p>
        </div>

        {state === 'Sign Up' && (
          <div className="w-full">
            <label className="text-sm font-medium block mb-1">Full Name</label>
            <input
              className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium block mb-1">Password</label>
          <input
            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base hover:bg-opacity-90 transition"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-500">
          {state === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-primary underline cursor-pointer font-medium"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              New to DocTalk?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-primary underline cursor-pointer font-medium"
              >
                Create one
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;
