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
  getMyBookings: (page, size) => {
    return api.getAsync(`/bookings/borrower/pending?page=${page}&size=${size}`);
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
  ownerPending: (page, size) => {
    return api.getAsync(`/bookings/owner/pending?page=${page}&size=${size}`);
  },
  ownerRentals: (type, page, size) => {
    return api.getAsync(`/bookings/owner/${type}?page=${page}&size=${size}`);
  },
  borrowerRentals: (type, page, size) => {
    return api.getAsync(`/bookings/borrower/${type}?page=${page}&size=${size}`);
  },
};

export default BookingService;
