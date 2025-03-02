import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateEvent } from "../../redux/slices/eventSlice";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date(),
    time: "",
    location: "",
    price_vip: "",
    price_regular: "",
    tickets_vip: "",
    tickets_regular: "",
  });

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: new Date(event.date),
        time: event.time,
        location: event.location,
        price_vip: event.price_vip,
        price_regular: event.price_regular,
        tickets_vip: event.tickets_vip,
        tickets_regular: event.tickets_regular,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEvent({ id, ...formData }))
      .unwrap()
      .then(() => {
        Swal.fire("Success!", "Event updated!", "success");
        navigate("/admin/events");
      })
      .catch((error) => {
        Swal.fire("Error!", error.error || "Failed to update event.", "error");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border rounded" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <DatePicker selected={formData.date} onChange={handleDateChange} className="w-full p-2 border rounded" />
        <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="Time" className="w-full p-2 border rounded" required />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
        <input type="number" name="price_vip" value={formData.price_vip} onChange={handleChange} placeholder="VIP Price" className="w-full p-2 border rounded" required />
        <input type="number" name="price_regular" value={formData.price_regular} onChange={handleChange} placeholder="Regular Price" className="w-full p-2 border rounded" required />
        <input type="number" name="tickets_vip" value={formData.tickets_vip} onChange={handleChange} placeholder="VIP Tickets" className="w-full p-2 border rounded" required />
        <input type="number" name="tickets_regular" value={formData.tickets_regular} onChange={handleChange} placeholder="Regular Tickets" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Update Event</button>
      </form>
    </div>
  );
};

export default UpdateEvent;