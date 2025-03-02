import React from "react";
import { useEffect } from "react";
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
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Hi-Events Logo" className="h-12 mr-4" />
      </div>
      <Carousel images={carouselImages} />
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
      <section className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-600">
          Hi-Events is your premier destination for discovering and booking unforgettable events.
        </p>
      </section>
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