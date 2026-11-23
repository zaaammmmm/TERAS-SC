// file: src/components/LandingPage.jsx

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3, MapPin, Users } from 'lucide-react';

import AboutImage from '../assets/About.jpg';
import HeroBgImage from '../assets/background.png';
import Header from './utils/Header';
// import './LandingPage.css'; // HAPUS - Menggunakan kelas Tailwind

import IconConfirm from '../assets/icon-confirm.png';
import IconForm from '../assets/icon-form.png';
import IconSearch from '../assets/icon-search.png';
import IconSelect from '../assets/icon-select.png';

// === Ikon Sosial Media (pakai react-icons) ===
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { getAllRooms } from '../api/rooms';
import { getTodayRoomPreview } from '../api/bookings';

import roomA from '../assets/sc/co-space-a.jpg';
import roomB from '../assets/sc/co-space-b.jpg';
import roomC from '../assets/sc/co-space-c.jpg';
import roomD from '../assets/sc/co-space-d.jpg';
import roomE from '../assets/sc/co-space-e.jpg';
import roomF from '../assets/sc/co-space-f.jpg';
import roomEast from '../assets/sc/co-space-east.jpg';

// GANTI DENGAN DATA DARI API
const roomImages = [
  { match: 'space a', image: roomA },
  { match: 'space b', image: roomB },
  { match: 'space c', image: roomC },
  { match: 'space d', image: roomD },
  { match: 'space e', image: roomE },
  { match: 'space f', image: roomF },
  { match: 'east', image: roomEast },
];

const timeSlotStarts = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

const formatDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getRoomImage = (name = '') => roomImages.find(({ match }) => name.toLowerCase().includes(match))?.image || roomA;

const LandingPage = () => {
  const [today] = useState(() => new Date());
  const [rooms, setRooms] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPreview = async () => {
      try {
        setPreviewLoading(true);
        const dateKey = formatDateKey(today);
        const [roomData, bookingData] = await Promise.all([
          getAllRooms(),
          getTodayRoomPreview(dateKey),
        ]);

        if (active) {
          const normalizedRooms = Array.isArray(roomData) ? roomData : [];
          const normalizedBookings = Array.isArray(bookingData) ? bookingData : [];
          setRooms(normalizedRooms.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '')));
          setApprovedBookings(normalizedBookings);
        }
      } catch (error) {
        console.error('Gagal memuat preview ruangan:', error);
        if (active) {
          setRooms([]);
          setApprovedBookings([]);
        }
      } finally {
        if (active) setPreviewLoading(false);
      }
    };

    loadPreview();
    return () => { active = false; };
  }, [today]);

  const previewRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  const isCurrentlyBooked = (roomName) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return Array.isArray(approvedBookings) && approvedBookings.some((booking) => {
      if (booking.room?.name !== roomName) return false;
      const [startHour, startMinute] = (booking.startTime || '00:00').split(':').map(Number);
      const [endHour, endMinute] = (booking.endTime || '00:00').split(':').map(Number);
      return currentMinutes >= startHour * 60 + startMinute && currentMinutes < endHour * 60 + endMinute;
    });
  };

  const getOccupiedCount = (roomName) => (Array.isArray(approvedBookings) ? approvedBookings : []).filter((booking) =>
    booking.room?.name === roomName && timeSlotStarts.includes(booking.startTime)
  ).length;

  const availableRoomCount = rooms.filter((room) => getOccupiedCount(room.name) < timeSlotStarts.length).length;

  return (
    <div className="landing-page-container">
      <Header isLandingPage={true} />

      {/* Scroll 1: HERO SECTION (ID: BERANDA) */}
      <section 
          // .hero-section -> relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center
          className="relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center" 
          id="beranda" 
          style={{ backgroundImage: `url(${HeroBgImage})` }} 
      >
        {/* .hero-overlay -> absolute inset-0 bg-black/55 flex items-center justify-center */}
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <div className="max-w-4xl px-4">
            {/* h1 -> text-5xl font-extrabold mb-4 */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Ruang kampus, lebih mudah dipesan.</h1>
            {/* p -> text-xl max-w-2xl mx-auto mb-8 */}
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Temukan ruang yang sesuai untuk belajar, rapat organisasi, maupun kegiatan kampus. Periksa jadwal dan ajukan reservasi dalam satu tempat.
            </p>
            <Link to="/dashboard" className="no-underline">
               {/* .hero-cta -> bg-white text-[#155E38] px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 */}
               <button className="bg-white text-[#155E38] px-4 sm:px-6 md:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg md:text-xl font-bold cursor-pointer transition-colors duration-200 hover:bg-gray-100 shadow-xl">
                 Mulai Reservasi
               </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll 2: ABOUT SECTION (ID: ABOUT) */}
      <section 
        // .about-section -> bg-white h-screen p-20 flex justify-between items-center
        className="bg-white h-screen p-20 flex justify-between items-center max-lg:flex-col max-lg:h-auto max-lg:py-16 max-lg:px-8" 
        id="about"
      >
        {/* .about-content -> flex-1 max-w-3xl */}
        <div className="flex-1 max-w-3xl max-lg:max-w-full max-lg:mb-8">
          {/* h2 -> text-[#155E38] text-3xl font-bold mb-4 */}
          <h2 className="text-[#155E38] text-3xl sm:text-4xl font-bold mb-4">Satu tempat untuk kebutuhan ruang kampus.</h2>
          {/* p -> line-height-relaxed text-gray-700 */}
          <p className="leading-relaxed text-gray-700 text-lg">
            Teras Student Center membantu mahasiswa menemukan ruang, melihat ketersediaan jadwal, dan mengajukan peminjaman dengan alur yang lebih jelas. Semua kebutuhan reservasi ruang terhubung dalam satu layanan.
          </p>
        </div>
        {/* .about-image-placeholder -> w-96 h-72 shadow-xl overflow-hidden rounded-xl */}
        <div className="w-96 h-72 shadow-xl overflow-hidden rounded-xl flex-shrink-0">
          <img 
            src={AboutImage} 
            alt="UIN Sunan Kalijaga" 
            // .about-image-content -> w-full h-full object-cover rounded-xl
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Scroll 3: TUTORIAL/RESERVASI SECTION (ID: TUTORIAL) */}
      <section 
        // .reservasi-section -> bg-[#155E38] h-screen text-white p-20 flex-col justify-center items-center
        className="bg-[#155E38] h-screen text-white p-20 flex flex-col justify-center items-center max-lg:h-auto max-lg:py-16 max-lg:px-8" 
        id="tutorial"
      >
        {/* h3 -> text-4xl font-bold mb-1 */}
        <h3 className="text-3xl sm:text-4xl font-bold mb-1 text-white">Cara Reservasi</h3>
        {/* .reservasi-subtitle -> italic opacity-90 mb-16 text-lg */}
        <p className="italic opacity-90 mb-16 text-lg">Empat langkah sederhana untuk menggunakan ruang Student Center.</p>
        
        {/* .steps-container -> flex justify-around gap-6 max-w-6xl w-full */}
        <div className="flex justify-around gap-6 max-w-6xl w-full max-lg:flex-col">
          
          <div 
            // .step-card -> bg-[#F8F8F8] text-[#333] p-8 rounded-[15px] flex-1 shadow-xl hover:-translate-y-2
            className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6"
          >
            {/* .step-icon -> flex justify-center items-center w-20 h-20 rounded-full bg-[#155E38] mx-auto mb-5 */}
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#155E38] mx-auto mb-5">
              {/* .icon-image -> w-12 h-12 object-contain */}
              <img src={IconSearch} alt="Cek Ketersediaan" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2">Cek Ketersediaan</h4>
            <p className="text-base text-gray-600">Klik tombol "Cek Ketersediaan & Pesan" untuk melihat jadwal</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#155E38] mx-auto mb-5">
              <img src={IconSelect} alt="Pilih Ruangan & waktu" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2">Pilih Ruangan & waktu</h4>
            <p className="text-base text-gray-600">Pilih ruangan, tanggal, dan waktu yang Anda inginkan.</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#155E38] mx-auto mb-5">
              <img src={IconForm} alt="Isi Detail & Kirim" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2">Isi Detail & Kirim</h4>
            <p className="text-base text-gray-600">Lengkapi formulir peminjaman dengan detail kegiatan Anda.</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#155E38] mx-auto mb-5">
              <img src={IconConfirm} alt="Tunggu Konfirmasi" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2">Tunggu Konfirmasi</h4>
            <p className="text-base text-gray-600">Anda akan menerima konfirmasi saat pesanan Anda disetujui</p>
          </div>
        </div>
      </section>

      {/* ROOM TODAY PREVIEW */}
      <section className="bg-[#f4f7f4] px-6 py-16 sm:px-10 lg:px-20" id="ruangan-hari-ini">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#155E38]">
                <CalendarDays size={15} /> Kondisi ruangan hari ini
              </span>
              <h2 className="text-3xl font-bold text-[#183c29] sm:text-4xl">Cek gambaran ruang sebelum memesan.</h2>
              <p className="mt-2 text-sm text-gray-600">
                {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[#155E38] px-5 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-[#0F4A2C]">
              Lihat semua ruangan <ArrowRight size={16} />
            </Link>
          </div>

          {!previewLoading && rooms.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#dfe8e1] bg-white px-4 py-3">
                <p className="text-xs text-gray-500">Total ruangan</p>
                <p className="mt-1 text-2xl font-extrabold text-[#183c29]">{rooms.length}</p>
              </div>
              <div className="rounded-xl border border-[#dfe8e1] bg-white px-4 py-3">
                <p className="text-xs text-gray-500">Masih dapat dipesan</p>
                <p className="mt-1 text-2xl font-extrabold text-[#155E38]">{availableRoomCount}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-[#dfe8e1] bg-white px-4 py-3 sm:col-span-1">
                <p className="text-xs text-gray-500">Slot disetujui hari ini</p>
                <p className="mt-1 text-2xl font-extrabold text-[#183c29]">{approvedBookings.length}</p>
              </div>
            </div>
          )}

          {previewLoading ? (
            <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-[#d2ddd4] bg-white text-sm text-gray-500">
              Memuat kondisi ruangan...
            </div>
          ) : previewRooms.length === 0 ? (
            <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-[#d2ddd4] bg-white text-sm text-gray-500">
              Preview ruangan belum dapat dimuat.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {previewRooms.map((room) => {
                const occupiedCount = getOccupiedCount(room.name);
                const availableSlots = timeSlotStarts.length - occupiedCount;
                const currentlyBooked = isCurrentlyBooked(room.name);

                return (
                  <article key={room._id || room.name} className="overflow-hidden rounded-2xl border border-[#dde6df] bg-white shadow-sm">
                    <div className="relative h-44 overflow-hidden bg-[#dce8df]">
                      <img
                        src={room.image || getRoomImage(room.name)}
                        alt={room.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${currentlyBooked ? 'bg-[#fff4d6] text-[#805b10]' : availableSlots > 0 ? 'bg-white text-[#155E38]' : 'bg-gray-100 text-gray-600'}`}>
                        <span className={`h-2 w-2 rounded-full ${currentlyBooked ? 'bg-[#d79b25]' : availableSlots > 0 ? 'bg-[#2c985b]' : 'bg-gray-400'}`} />
                        {currentlyBooked ? 'Sedang digunakan' : availableSlots > 0 ? `${availableSlots} slot tersedia` : 'Jadwal penuh'}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-[#183c29]">{room.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {room.location || 'Student Center'}</span>
                        {room.capacity && <span className="inline-flex items-center gap-1.5"><Users size={13} /> {room.capacity} orang</span>}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-gray-500"><Clock3 size={13} /> Booking disetujui</span>
                        <strong className="text-[#155E38]">{occupiedCount} dari 7 slot</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!previewLoading && previewRooms.length > 0 && (
            <p className="mt-5 text-center text-xs text-gray-500">Menampilkan {previewRooms.length} dari {rooms.length} ruangan sebagai preview. Data diperbarui saat halaman dibuka.</p>
          )}
        </div>
      </section>

      {/* FOOTER SECTION (Tambahkan id="footer") */}
      <footer 
        // .footer-section -> bg-[#0F4A2C] text-white p-10 text-center
        className="bg-[#0F4A2C] text-white p-10 text-center" 
        id="footer"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="contact-info">
            <h4 className="mb-2 text-lg font-bold text-gray-100">Hubungi Teras SC</h4>
            <p className="m-0 text-base opacity-90">Email: terassc@gmail.com</p>
            <p className="m-0 text-base opacity-90">Telp/WA: +62 812 3456 7890</p>
          </div>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.instagram.com/terassc" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#155E38]">
              <FaInstagram />
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#155E38]">
              <FaWhatsapp />
            </a>
            <a href="https://www.linkedin.com/company/terassc" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#155E38]">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <p className="mt-5 text-sm opacity-70">© 2025 Teras SC. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
