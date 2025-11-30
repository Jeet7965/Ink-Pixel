// AboutUsAnimated.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Newsletter from '../components/NewsSletter';

const services = [
    {
        title: 'Image Upload & Download',
        description: 'Upload your best images and download high-quality content shared by others.',
    },
    {
        title: 'Video Upload & Download',
        description: 'Seamlessly share videos and explore a world of multimedia content.',
    },
    {
        title: 'Blogs & Articles',
        description: 'Read, write, and share insights with our blogging platform designed for all creators.',
    },
];

const customers = ['Customer 1', 'Customer 2', 'Customer 3', 'Customer 4'];

const team = [
    { name: 'Jane Doe', role: 'Founder & CEO', img: 'https://via.placeholder.com/150' },
    { name: 'John Smith', role: 'Lead Developer', img: 'https://via.placeholder.com/150' },
    { name: 'Emily Johnson', role: 'Creative Director', img: 'https://via.placeholder.com/150' },
];

// Animated Service Card
const ServiceCard = ({ title, description }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out text-center">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// Animated Customer Card
const CustomerCard = ({ name }) => (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition transform hover:scale-105 duration-300 text-center">
        {name}
    </div>
);

// Animated Team Card with overlay
const TeamCard = ({ name, role, img }) => (
    <div className="relative p-6 bg-white rounded-xl shadow-lg overflow-hidden group">
        <img src={img} alt={name} className="mx-auto rounded-full mb-4 w-32 h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-gray-600">{role}</p>
        <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl"></div>
    </div>
);

const AboutUs = () => {
    return (
        <>
            <Navbar></Navbar>
            <section className="bg-gray-50 w-full">

                {/* Hero with background image */}
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-32 px-5 text-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">About Ink & Pixel</h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fadeIn delay-200">
                            Your one-stop platform to upload, download, and explore images, videos, and blogs. Fully responsive and crafted for creators everywhere.
                        </p>
                    </div>
                </div>

                {/* Mission with accent colors */}
                <div className="py-16 px-5 max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold mb-6 text-indigo-600 animate-slideUp">Our Mission</h2>
                    <p className="text-gray-700 text-lg md:text-xl animate-slideUp delay-200">
                        At Ink & Pixel, we aim to empower creators by providing a seamless platform for sharing media and ideas. Creativity has no limits here.
                    </p>
                </div>

                {/* Services with images */}
                <div className="py-16 px-5 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-center mb-12 animate-slideUp text-purple-600">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {services.map((service, index) => (
                            <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300">
                                <img
                                    src={`https://source.unsplash.com/400x300/?${service.title.split(' ')[0]}`}
                                    alt={service.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customers section with colored cards */}
                <div className="py-16 px-5 max-w-6xl mx-auto bg-gray-100 rounded-xl">
                    <h2 className="text-3xl font-semibold text-center mb-12 text-indigo-600 animate-slideUp">Our Valued Customers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
                        {customers.map((customer, index) => (
                            <div key={index} className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white p-6 rounded-xl shadow hover:scale-105 transform transition">
                                {customer}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team section with images */}
                <div className="py-16 px-5 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-center mb-12 text-purple-600 animate-slideUp">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {team.map((member, index) => (
                            <div key={index} className="relative p-6 bg-white rounded-xl shadow-lg overflow-hidden group">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="mx-auto rounded-full mb-4 w-32 h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-gray-600">{member.role}</p>
                                <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action with gradient and background image */}
                <div className="relative py-16 px-5 text-white text-center rounded-xl mx-5 my-10 bg-gradient-to-r from-purple-600 to-indigo-500 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                        alt="CTA Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-semibold mb-4">Join the Ink & Pixel Community</h2>
                        <p className="mb-6">Upload, download, and explore a world of creativity today!</p>
                        <a
                            href="/signup"
                            className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition"
                        >
                            Get Started
                        </a>
                    </div>
                </div>

            </section>

            <Newsletter></Newsletter>
        </>
    );
};

export default AboutUs;
