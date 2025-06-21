import React from 'react';
import { assets } from '../assets/assets';


const Contact = () => {
  return (
    <div className="px-6 md:px-16 py-16 text-gray-700">
      <div className="text-center text-2xl font-semibold mb-10">
        <p>CONTACT <span className="text-blue-600">US</span></p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left - Image */}
        <img
          src={assets.contact_image}
          alt="Doctor with patient"
          className="w-full md:w-1/2 rounded-lg shadow-md object-cover"
        />

        {/* Right - Details */}
        <div className="flex flex-col gap-10 w-full md:w-1/2">
          {/* Office Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">OUR OFFICE</h3>
            <p className="text-sm">IIT Kharagpur</p>
            <p className="text-sm">Kharagpur WestBengal, India</p>
            <p className="text-sm mt-2">Tel: (415) 555-0132</p>
            <p className="text-sm">Email: shubham84095@gmail.com</p>
          </div>

          {/* Careers Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">CAREERS AT DOCTALK</h3>
            <p className="text-sm mb-4">Learn more about our teams and job openings.</p>
            <button className="border border-gray-700 px-6 py-2 text-sm rounded hover:bg-gray-100 transition">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
