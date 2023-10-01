import api from "../api";

const BookingService = {
  getAll: () => {
    return api.getAsync("/bookings");
  },

  createBooking: (booking) => {
    return api.postAsync("/bookings", booking);
  },

  updateBooking: (booking) => {
    return api.putAsync("/bookings", booking);
  },

  deleteBooking: (id) => {
    return api.deleteAsync(`/bookings/${id}`);
  },
  cancelBooking: (id) => {
    return api.putAsync(`/bookings/cancel/${id}`);
  },
  getMyBookings: () => {
    return api.getAsync(`/bookings/self`);
  },
  acceptBooking: (id) => {
    return api.putAsync(`/bookings/accept/${id}`);
  },
  rejectBooking: (id) => {
    return api.putAsync(`/bookings/reject/${id}`);
  },
  markReceived: (id) => {
    return api.putAsync(`/bookings/lent/${id}`);
  },
  markAsReturned: (id) => {
    return api.putAsync(`/bookings/complete/${id}`);
  },
  addReview: (review) => {
    return api.postAsync(`/reviews`, review);
  },
};

export default BookingService;
