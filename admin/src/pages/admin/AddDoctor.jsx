import React, { use, useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [adress1, setAdress1] = useState('')
    const [adress2, setAdress2] = useState('')

    const { backendURL, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!docImg) {
            return toast.error('Image not selected');
        }

        const formData = new FormData();
        formData.append('image', docImg);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('experience', experience);
        formData.append('fees', Number(fees));
        formData.append('about', about);
        formData.append('speciality', speciality);
        formData.append('degree', degree);
        formData.append('address', JSON.stringify({ line1: adress1, line2: adress2 }));

        // Show loading toast
        const toastId = toast.loading('Adding doctor...');

        try {
            const { data } = await axios.post(
                backendURL + '/api/admin/add-doctor',
                formData,
                { headers: { aToken } }
            );

            if (data.success) {
                toast.update(toastId, {
                    render: data.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                // Clear form state
                setDocImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAdress1('');
                setAdress2('');
                setDegree('');
                setAbout('');
                setFees('');
            } else {
                toast.update(toastId, {
                    render: data.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        } catch (error) {
            toast.update(toastId, {
                render: error.message || "Something went wrong",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            console.log(error);
        }
    };
    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-xl font-semibold text-gray-700">Add Doctor</p>
            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* Upload section */}
                <div className="flex items-center gap-4 mb-8 text-gray-600">
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <img
                            className="w-16 bg-gray-100 rounded-full"
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Upload"
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p className="text-sm">
                        Upload doctor <br /> Picture
                    </p>
                </div>

                {/* Form fields */}
                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-700">
                    {/* Left Section */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div>
                            <p className="mb-1">Doctor Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full border rounded px-3 py-2"
                                type="text"
                                placeholder="Name"
                                required
                            />
                        </div>
                        <div>
                            <p className="mb-1">Email</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full border rounded px-3 py-2"
                                type="email"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <p className="mb-1">Password</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full border rounded px-3 py-2"
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div>
                            <p className="mb-1">Doctor's Experience</p>
                            <select className="w-full border rounded px-3 py-2" onChange={(e) => setExperience(e.target.value)}
                                value={experience}>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i}>{i + 1} Year</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="mb-1">Fees</p>
                            <input
                                onChange={(e) => setFees(e.target.value)}
                                value={fees}
                                className="w-full border rounded px-3 py-2"
                                type="number"
                                placeholder="Fees"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div>
                            <p className="mb-1">Speciality</p>
                            <select className="w-full border rounded px-3 py-2" onChange={(e) => setSpeciality(e.target.value)}
                                value={speciality}>
                                {[
                                    'General physician',
                                    'Gynecologist',
                                    'Dermatologist',
                                    'Pediatricians',
                                    'Neurologist',
                                    'Gastroenterologist',
                                ].map((spec) => (
                                    <option key={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="mb-1">Education</p>
                            <input
                                onChange={(e) => setDegree(e.target.value)}
                                value={degree}
                                className="w-full border rounded px-3 py-2"
                                type="text"
                                placeholder="Education"
                                required
                            />
                        </div>
                        <div>
                            <p className="mb-1">Clinic Address</p>
                            <input
                                onChange={(e) => setAdress1(e.target.value)}
                                value={adress1}
                                className="w-full border rounded px-3 py-2 mb-2"
                                type="text"
                                placeholder="Address Line 1"
                                required
                            />
                            <input
                                onChange={(e) => setAdress2(e.target.value)}
                                value={adress2}
                                className="w-full border rounded px-3 py-2"
                                type="text"
                                placeholder="Address Line 2"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* About Doctor */}
                <div className="mt-6">
                    <p className="mb-2">About Doctor</p>
                    <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        className="w-full px-4 pt-2 border rounded resize-none"
                        placeholder="Write about doctor"
                        required
                        rows={5}
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 transition-colors px-10 py-3 text-white font-semibold rounded-full"
                    >
                        Add Doctor
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddDoctor;
