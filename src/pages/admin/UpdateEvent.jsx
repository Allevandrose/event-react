import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateEvent } from "../../redux/slices/eventSlice";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../utils/api";

const UpdateEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);

  // Initialize state with default values
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

  // Fetch event details when component mounts
  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  // Update form data when event data is available
  useEffect(() => {
    if (event) {
      const parsedDate = new Date(event.date);
      const safeDate = isNaN(parsedDate) ? new Date() : parsedDate;

      setFormData({
        name: event.name || "",
        description: event.description || "",
        date: safeDate, // Ensure valid date
        time: event.time || "",
        location: event.location || "",
        price_vip: event.price_vip || "",
        price_regular: event.price_regular || "",
        tickets_vip: event.tickets_vip || "",
        tickets_regular: event.tickets_regular || "",
        image: event.image ? `${API_BASE_URL}${event.image}` : null, // Full image URL
      });
    }
  }, [event]);

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date picker change
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate and format the date
    let submitDate = new Date(formData.date);
    if (isNaN(submitDate.getTime())) {
      submitDate = new Date(); // Default to current date if invalid
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", submitDate.toISOString().split("T")[0]); // Ensure correct format
    formDataToSend.append("time", formData.time);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("price_vip", formData.price_vip);
    formDataToSend.append("price_regular", formData.price_regular);
    formDataToSend.append("tickets_vip", formData.tickets_vip);
    formDataToSend.append("tickets_regular", formData.tickets_regular);

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    dispatch(updateEvent({ id, data: formDataToSend }))
      .unwrap()
      .then(() => {
        Swal.fire("Success!", "Event updated successfully!", "success");
        navigate("/admin/events");
      })
      .catch((error) => {
        Swal.fire("Error!", error.error || "Failed to update event.", "error");
      });
  };

  // Display loading or error messages
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {/* Event Name */}
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border rounded" required />

        {/* Description */}
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />

        {/* Date Picker */}
        <DatePicker selected={formData.date} onChange={handleDateChange} className="w-full p-2 border rounded" />

        {/* Time */}
        <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="Time" className="w-full p-2 border rounded" required />

        {/* Location */}
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />

        {/* VIP Price */}
        <input type="number" name="price_vip" value={formData.price_vip} onChange={handleChange} placeholder="VIP Price" className="w-full p-2 border rounded" required />

        {/* Regular Price */}
        <input type="number" name="price_regular" value={formData.price_regular} onChange={handleChange} placeholder="Regular Price" className="w-full p-2 border rounded" required />

        {/* VIP Tickets */}
        <input type="number" name="tickets_vip" value={formData.tickets_vip} onChange={handleChange} placeholder="VIP Tickets" className="w-full p-2 border rounded" required />

        {/* Regular Tickets */}
        <input type="number" name="tickets_regular" value={formData.tickets_regular} onChange={handleChange} placeholder="Regular Tickets" className="w-full p-2 border rounded" required />

        {/* Image Preview */}
        {formData.image && (
          <div className="mb-4">
            <p className="font-semibold">Current Image:</p>
            <img
              src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
              alt="Event preview"
              className="mt-2 w-full h-48 object-cover rounded"
            />
          </div>
        )}

        {/* Image Upload Input */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">
            Update Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
