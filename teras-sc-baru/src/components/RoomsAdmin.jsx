// file: src/components/RoomsAdmin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; 
import DateNavigator from './DateNavigator'; // <-- IMPORT BARU

// Data Ruangan Dummy (7 Ruangan)
const roomsData = [
    { id: 1, name: 'Co-Working Space A', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Available' }, { label: '09.00', status: 'Booked' }, { label: '11.00', status: 'Booked' }, { label: '13.00', status: 'Available' },] },
    { id: 2, name: 'Co-Working Space B', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Booked' }, { label: '09.00', status: 'Available' }, { label: '11.00', status: 'Available' }, { label: '13.00', status: 'Booked' },] },
    { id: 3, name: 'Co-Working Space C', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Available' }, { label: '09.00', status: 'Booked' }, { label: '11.00', status: 'Available' }, { label: '13.00', status: 'Available' },] },
    { id: 4, name: 'Co-Working Space D', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Available' }, { label: '09.00', status: 'Available' }, { label: '11.00', status: 'Booked' }, { label: '13.00', status: 'Booked' },] },
    { id: 5, name: 'Co-Working Space E', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Booked' }, { label: '09.00', status: 'Booked' }, { label: '11.00', status: 'Booked' }, { label: '13.00', status: 'Available' },] },
    { id: 6, name: 'Co-Working Space F', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Available' }, { label: '09.00', status: 'Available' }, { label: '11.00', status: 'Available' }, { label: '13.00', status: 'Booked' },] },
    { id: 7, name: 'Co-Working Space EAST', location: 'Gedung SC Lantai 3', image: 'https://placehold.co/101x98', times: [{ label: '07.00', status: 'Booked' }, { label: '09.00', status: 'Booked' }, { label: '11.00', status: 'Booked' }, { label: '13.00', status: 'Booked' },] },
];

const AdminRoomCard = ({ room }) => {
    const navigate = useNavigate();
    const PRIMARY_COLOR = '#3D5B81';

    const getTimeSlotClass = (status) => {
        if (status === 'Booked') {
            return "bg-slate-600 text-white"; 
        } else {
            return "bg-blue-100 text-slate-600";
        }
    };

    return (
        <div className="bg-neutral-100 p-4 rounded-xl flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-lg max-md:flex-col max-md:items-start max-md:space-y-4">
            
            <div className="flex items-center space-x-6 w-full max-md:w-full max-md:flex-col max-md:items-start max-md:space-x-0">
                
                <img 
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0" 
                    src={room.image} 
                    alt={room.name} 
                />
                
                <div className="flex flex-col flex-grow">
                    <div className="text-slate-600 text-2xl font-bold mb-1">
                        {room.name}
                    </div>
                    <div className="text-black text-base font-normal mb-1">
                        {room.location}
                    </div>
                    <div className="text-black text-base font-normal mb-3">
                        Waktu Tersedia Hari Ini:
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {room.times.map((time, index) => (
                            <div 
                                key={index} 
                                className={`w-14 h-6 flex items-center justify-center rounded-md text-xs font-semibold ${getTimeSlotClass(time.status)}`}
                            >
                                {time.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => navigate(`/admin/rooms/detail/${room.id}`)}
                className={`w-32 h-10 bg-[${PRIMARY_COLOR}] rounded-lg text-white text-base font-bold transition-colors hover:bg-[#2e4764] flex items-center justify-center ml-4 flex-shrink-0 max-md:w-full max-md:mt-4`}
            >
                Detail
            </button>
        </div>
    );
};

const RoomsAdmin = () => {
    const PRIMARY_COLOR = '#3D5B81';
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="w-full space-y-6">
            
            {/* Navigasi Tanggal */}
            <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />


            {/* Konten Utama (Daftar Ruangan) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg shadow-black/5 space-y-4">
                
                {roomsData.map((room) => (
                    <AdminRoomCard key={room.id} room={room} />
                ))}
            </div>
            
        </div>
    );
};

export default RoomsAdmin;