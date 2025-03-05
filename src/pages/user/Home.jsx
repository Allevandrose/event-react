import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventSlice";
import EventCard from "../../components/common/EventCard";
import Carousel from "../../components/carousel/Carousel";
import banner1 from "../../assets/images/banner.jpg";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.jpg";
import logo from "../../assets/logo1.png";

const Home = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleBook = (event) => {
    console.log("Booking event:", event);
  };

  const carouselImages = [banner1, banner2, banner3];
  const futureEvents = events.filter((event) => new Date(event.date) >= new Date());

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Hi-Events Logo" className="h-12 mr-4" />
      </div>

      {/* Image Carousel */}
      <Carousel images={carouselImages} />

      {/* Upcoming Events Section */}
      <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-6 text-center">Upcoming Events</h2>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureEvents.map((event) => (
            <EventCard key={event.id} event={event} onBook={handleBook} />
          ))}
        </div>
      )}

      {/* About Hi-Events Section */}
      <section className="mt-16 bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center">
        {/* Left - Image */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src="https://picsum.photos/600/400"
            alt="About Hi-Events"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Right - Text Content */}
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Hi-Events 🎉</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            At **Hi-Events**, we bring people together through unforgettable experiences. Whether 
            you're looking for live concerts, exclusive parties, or business networking events, we 
            have something for everyone. Our platform provides a **seamless booking experience**, 
            **VIP access to top-tier events**, and a **secure ticketing system**.  
            <br /><br />
            Discover events that match your passion, connect with like-minded individuals, and create 
            memories that last a lifetime. With our **24/7 support and hassle-free booking**, Hi-Events 
            is your **ultimate gateway to entertainment**. 🎶🎭  
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Diverse range of events</li>
          <li>Secure booking process</li>
          <li>Exclusive VIP access</li>
          <li>24/7 support</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
