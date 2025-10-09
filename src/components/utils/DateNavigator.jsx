// file: src/components/DateNavigator.jsx
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Format tanggal menjadi "dd/mm/yyyy"
const formatDate = (date) => {
    return date
        .toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\//g, '/');
};

// Format hari menjadi "Kamis"
const formatDay = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
};

const DateNavigator = ({ selectedDate, setSelectedDate }) => {
    const PRIMARY_COLOR = '#3D5B81';

    const handleDateChange = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl shadow-lg border border-gray-200 gap-4">
                
                {/* Judul */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#3D5B81] text-center sm:text-left">
                    Data Penggunaan Ruangan
                </h1>

                {/* Navigasi tanggal */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                    
                    {/* === MOBILE MODE === */}
                    <div className="relative flex items-center justify-center sm:hidden w-full">
                        {/* Tombol kiri di atas kalender */}
                        <button
                            onClick={() => handleDateChange(-1)}
                            className="absolute left-2 bg-[#3D5B81] text-white p-2 rounded-lg shadow-md hover:bg-[#2e4764] transition"
                        >
                            <FaAngleLeft className="w-4 h-4" />
                        </button>

                        {/* Input tanggal */}
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="border border-gray-300 rounded-lg p-2 pl-10 pr-10 text-sm font-medium text-gray-700 bg-white shadow-inner w-full text-center"
                        />

                        {/* Tombol kanan di atas kalender */}
                        <button
                            onClick={() => handleDateChange(1)}
                            className="absolute right-2 bg-[#3D5B81] text-white p-2 rounded-lg shadow-md hover:bg-[#2e4764] transition"
                        >
                            <FaAngleRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* === DESKTOP MODE === */}
                    <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                        {/* Tombol Kiri */}
                        <button
                            onClick={() => handleDateChange(-1)}
                            className="p-3 rounded-xl bg-[#3D5B81] text-white transition-colors hover:bg-[#2e4764] shadow-md"
                        >
                            <FaAngleLeft className="w-5 h-5" />
                        </button>

                        {/* Nama Hari */}
                        <div className="text-xl font-semibold text-gray-800 text-center w-28 capitalize">
                            {formatDay(selectedDate)}
                        </div>

                        {/* Input tanggal */}
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="border border-gray-300 rounded-lg p-3 text-lg font-medium text-gray-700 bg-white shadow-inner"
                            style={{ minWidth: '150px' }}
                        />

                        {/* Tombol Kanan */}
                        <button
                            onClick={() => handleDateChange(1)}
                            className="p-3 rounded-xl bg-[#3D5B81] text-white transition-colors hover:bg-[#2e4764] shadow-md"
                        >
                            <FaAngleRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateNavigator;
