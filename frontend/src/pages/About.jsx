import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="px-6 md:px-16 py-10 text-gray-700">
      {/* Section Title */}
      <div className="text-center text-3xl font-semibold mb-12">
        <p>
          ABOUT <span className="text-blue-600">US</span>
        </p>
      </div>

      {/* About Content */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <img
          className="w-full md:max-w-[400px] rounded-xl shadow-md"
          src={assets.about_image}
          alt="About DocTalk"
        />

        <div className="flex flex-col justify-center gap-6 text-base leading-relaxed md:w-2/3">
          <p>
            Welcome to <span className="font-semibold text-blue-600">DocTalk</span>, your trusted
            partner in managing your healthcare needs conveniently and efficiently. At DocTalk, we
            understand the challenges individuals face when it comes to scheduling doctor
            appointments and managing their health records.
          </p>

          <p>
            <span className="font-semibold text-blue-600">DocTalk</span> is committed to excellence
            in healthcare technology. We continuously strive to enhance our platform by integrating
            the latest advancements to improve user experience and deliver superior service. Whether
            you're booking your first appointment or managing ongoing care, DocTalk is here to
            support you every step of the way.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Our Vision</h2>
            <p>
              Our vision at <span className="font-semibold text-blue-600">DocTalk</span> is to
              create a seamless healthcare experience for every user. We aim to bridge the gap
              between patients and healthcare providers, making it easier for you to access the care
              you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">
          WHY <span className="text-blue-600">CHOOSE US</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-300 p-6 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:shadow-md cursor-pointer">
          <h3 className="font-semibold text-gray-800 mb-2">EFFICIENCY:</h3>
          <p className="text-sm text-gray-600">
            Streamlined appointment scheduling that fits into your busy lifestyle.
          </p>
        </div>
        <div className="border border-gray-300 p-6 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:shadow-md cursor-pointer">
          <h3 className="font-semibold text-gray-800 mb-2">CONVENIENCE:</h3>
          <p className="text-sm text-gray-600">
            Access to a network of trusted healthcare professionals in your area.
          </p>
        </div>
        <div className="border border-gray-300 p-6 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:shadow-md cursor-pointer">
          <h3 className="font-semibold text-gray-800 mb-2">PERSONALIZATION:</h3>
          <p className="text-sm text-gray-600">
            Tailored recommendations and reminders to help you stay on top of your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
