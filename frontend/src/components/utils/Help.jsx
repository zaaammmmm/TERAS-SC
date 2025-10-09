// file: src/components/Help.jsx

import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nama: '',
        nim: '',
        jurusan: '',
        tujuan: ''
    });
    const PRIMARY_COLOR = '#3D5B81';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBackToDashboard = () => {
        // Logika cerdas untuk kembali ke Dashboard yang sesuai (User atau Admin)
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- Simulasi Pengiriman Data ---
        console.log('Laporan Terkirim:', formData);
        
        alert('Laporan Anda berhasil dikirim! Kami akan segera meninjau dan merespon Anda.');
        
        // Reset form
        setFormData({
            nama: '',
            nim: '',
            jurusan: '',
            tujuan: ''
        });
        
        // KRITIKAL: Redirection otomatis setelah sukses
        handleBackToDashboard(); 
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 px-4 sm:px-6">

            {/* --- Tombol Kembali --- */}
            <button
                onClick={handleBackToDashboard}
                className={`flex items-center gap-2 text-gray-700 hover:text-[${PRIMARY_COLOR}] transition-colors text-sm font-semibold mb-4 pt-5`}
            >
                <FaArrowLeft /> Kembali ke Dashboard
            </button>
            {/* ---------------------- */}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Contact Person / Helpdesk
            </h1>

            {/* Kontainer Utama Form */}
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl border border-gray-200">
                <h2 className={`text-xl sm:text-2xl font-bold text-[#3D5B81] mb-6 border-b border-gray-200 pb-3`}>
                    Formulir Pengaduan atau Pertanyaan
                </h2>
                
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    
                    {/* Nama dan NIM (Satu Baris) */}
                    <div className="flex gap-5 max-md:flex-col">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="nama" className="font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label htmlFor="nim" className="font-semibold text-gray-700 mb-1">NIM</label>
                            <input
                                type="text"
                                id="nim"
                                name="nim"
                                value={formData.nim}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Jurusan */}
                    <div className="flex flex-col">
                        <label htmlFor="jurusan" className="font-semibold text-gray-700 mb-1">Jurusan / Program Studi</label>
                        <input
                            type="text"
                            id="jurusan"
                            name="jurusan"
                            value={formData.jurusan}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none"
                            required
                        />
                    </div>

                    {/* Tujuan Pelaporan */}
                    <div className="flex flex-col">
                        <label htmlFor="tujuan" className="font-semibold text-gray-700 mb-1">Tujuan / Isi Pelaporan</label>
                        <textarea
                            id="tujuan"
                            name="tujuan"
                            value={formData.tujuan}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg resize-y h-32 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none"
                            placeholder="Jelaskan secara rinci keluhan, saran, atau pertanyaan Anda terkait sistem peminjaman ruangan."
                            required
                        ></textarea>
                    </div>
                    
                    {/* Tombol Kirim */}
                    <button 
                        type="submit" 
                        className={`bg-[${PRIMARY_COLOR}] text-white p-3 rounded-lg text-lg font-semibold transition-colors hover:bg-[#2e4764] shadow-md mt-3`}
                    >
                        Kirim Laporan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Help;