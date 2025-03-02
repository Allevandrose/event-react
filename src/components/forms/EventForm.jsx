import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/slices/eventSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventForm = () => {
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
    image: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    dispatch(createEvent(data))
      .unwrap()
      .then(() => {
        Swal.fire("Success!", "Event created!", "success");
        navigate("/admin/events");
      })
      .catch((error) => {
        Swal.fire("Error!", error.error || "Failed to create event.", "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto" encType="multipart/form-data">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border rounded" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
      <DatePicker selected={formData.date} onChange={handleDateChange} className="w-full p-2 border rounded" />
      <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="Time (e.g., 7:00 PM)" className="w-full p-2 border rounded" required />
      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
      <input type="number" name="price_vip" value={formData.price_vip} onChange={handleChange} placeholder="VIP Price" className="w-full p-2 border rounded" required />
      <input type="number" name="price_regular" value={formData.price_regular} onChange={handleChange} placeholder="Regular Price" className="w-full p-2 border rounded" required />
      <input type="number" name="tickets_vip" value={formData.tickets_vip} onChange={handleChange} placeholder="VIP Tickets" className="w-full p-2 border rounded" required />
      <input type="number" name="tickets_regular" value={formData.tickets_regular} onChange={handleChange} placeholder="Regular Tickets" className="w-full p-2 border rounded" required />
      <input type="file" name="image" onChange={handleChange} className="w-full p-2 border rounded" accept="image/*" />
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Event</button>
    </form>
  );
};

export default EventForm;