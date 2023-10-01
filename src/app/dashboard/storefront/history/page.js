"use client";
import BookingService from "@/lib/services/bookingService";
import ProductService from "@/lib/services/productService";
import UserService from "@/lib/services/userService";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { InfoRounded } from "@mui/icons-material";
import GoogleMapReact from "google-map-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function page() {
  const tabs = [
    { name: "Ongoing", href: "#", current: true, type: "ACCEPTED" },
    { name: "Completed", href: "#", current: false, type: "COMPLETED" },
    { name: "All", href: "#", current: false, type: "ALL" },
  ];
  const [bookings, setBookings] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    comment: "",
    bookingId: "",
    reviewerId: "",
  });
  const handleOwnerDetails = (id) => {
    UserService.getOne(id)
      .then((res) => {
        setShowModal(true);
        setOwnerDetails(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const handleMarkReceived = (id) => {
    BookingService.markReceived(id)
      .then((res) => {
        toast.success("Marked as received");
        getBookings("ACCEPTED");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const router = useRouter();
  const rentAgain = (id) => {
    router.push(`/dashboard/storefront/products/${id}`);
  };

  const addReview = (id) => {
    setShowReviewModal(true);
  };

  const handleAddReview = (id) => {
    const data = {
      rating: ratingForm.rating,
      comment: ratingForm.comment,
      bookingId: id,
      reviewerId: user.id,
    };
    console.log(data);

    BookingService.addReview(data)
      .then((res) => {
        toast.success("Review added successfully");
        setShowReviewModal(false);
        getBookings("COMPLETED");
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  const getBookings = (tabtype) => {
    BookingService.getMyBookings()
      .then((res) => {
        res.map((booking) => {
          ProductService.getOne(booking.productResponse.productId).then(
            (res) => {
              booking.image = res.image1;
              booking.productResponse = res;
            }
          );

          booking.rentFrom = booking.rentFrom.slice(0, 10);
          booking.rentTo = booking.rentTo.slice(0, 10);
          booking.productName = booking.productResponse.name;
          booking.description = booking.productResponse.description;
          booking.borrowerName = booking.borrower.fullName;
          booking.address = booking.borrower.address;
        });
        if (tabtype === "ACCEPTED") {
          res = res.filter(
            (booking) =>
              booking.status === "ACCEPTED" || booking.status === "LENT"
          );
        } else if (tabtype === "COMPLETED") {
          res = res.filter((booking) => booking.status === "COMPLETED");
        } else {
          res = res.filter(
            (booking) =>
              booking.status !== "PENDING" &&
              booking.status !== "REJECTED" &&
              booking.status !== "CANCELLED"
          );
        }
        setBookings(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getBookings("ACCEPTED");
  }, []);

  return (
    <div className="bg-white">
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-w-screen-xl">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t ">
                  <h3 className="text-3xl font-semibold">Owner Details</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/* owner name, address, contact number */}
                <div className=" p-6 grid grid-cols-2 ">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">
                      {ownerDetails.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 my-3">
                      {ownerDetails.address}
                    </p>
                    <p className="text-sm text-gray-500 my-3">
                      {ownerDetails.phoneNumber}
                    </p>
                  </div>
                  <div className=" h-60 w-72">
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: process.env.GOOGLE_MAPS_API_KEY,
                        // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
                      }}
                      defaultCenter={{
                        lat: 0,
                        lng: 0,
                      }}
                      defaultZoom={12}
                      center={
                        (ownerDetails.lat && {
                          lat: ownerDetails.lat,
                          lng: ownerDetails.lng,
                        }) || {
                          lat: 0,
                          lng: 0,
                        }
                      }
                      className="h-screen	"
                    >
                      {ownerDetails && (
                        <div lat={ownerDetails.lat} lng={ownerDetails.lng}>
                          <img
                            className="w-8 h-8"
                            src="https://res.cloudinary.com/unishare/image/upload/v1695760752/Logo/marker-google-map.png"
                            alt="location"
                          />
                        </div>
                      )}
                    </GoogleMapReact>
                  </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order history
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and discover
              similar products.
            </p>
          </div>
        </div>
        {/* input all, completed , ongoing */}
        <div className="mt-12 sm:mt-16">
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
              <div className="sm:hidden">
                <label htmlFor="current-tab" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="current-tab"
                  name="current-tab"
                  className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  defaultValue={tabs.find((tab) => tab.current).name}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav
                  className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
                  aria-label="Tabs"
                >
                  {tabs.map((tab, tabIdx) => (
                    <button
                      onClick={() => {
                        getBookings(tab.type);
                        tab.current = true;
                        tabs.forEach((t) => {
                          if (t.name !== tab.name) {
                            t.current = false;
                          }
                        });
                      }}
                      aria-current={tab.current ? "page" : undefined}
                      className={classNames(
                        tab.current
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700",
                        tabIdx === 0 ? "rounded-l-lg" : "",
                        tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                        "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                      )}
                    >
                      <span>{tab.name}</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          tab.current ? "" : "bg-transparent",
                          "absolute inset-x-0 bottom-0 h-0.5"
                        )}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="sr-only">Recent orders</h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                {/* Products */}
                <h4 className="sr-only">Items</h4>
                <ul role="list" className="divide-y divide-gray-200">
                  {bookings &&
                    bookings.map(
                      (booking) =>
                        booking.status && (
                          <li key={booking.id} className="p-4 sm:p-6">
                            <div className="grid grid-cols-2 gap-x-4">
                              <div className="flex items-center sm:items-start">
                                <div className="h-10 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-20 sm:w-20">
                                  <img
                                    src={booking.productResponse.image1}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-6 flex-1 text-sm">
                                  <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                    <h5>{booking.productName}</h5>
                                    <p className="mt-2 sm:mt-0">
                                      {booking.total}
                                    </p>
                                  </div>
                                  <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                    {booking.description}
                                  </p>
                                  {/* order number, date placed, total bill */}
                                  <div className="mt-2 flex sm:mt-4 sm:space-x-4">
                                    <p className="text-gray-500">
                                      <span className=" font-semibold">
                                        From{" "}
                                      </span>{" "}
                                      {booking.rentFrom}
                                    </p>
                                    <p className="text-gray-500">
                                      <span className=" font-semibold">
                                        To{" "}
                                      </span>{" "}
                                      {booking.rentFrom}
                                    </p>
                                    <p className="text-gray-500">
                                      {booking.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                Your Review
                                <div className="text-lg text-gray-500">
                                  <ReactStars
                                    size={30}
                                    value={booking.productResponse.rating}
                                    edit={false}
                                  />
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.productResponse.comment}
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 sm:flex sm:justify-between">
                              <button
                                onClick={() =>
                                  handleOwnerDetails(
                                    booking.productResponse.ownerId
                                  )
                                }
                                className="flex items-center"
                              >
                                <InfoRounded
                                  className="h-5 w-5 text-indigo-400"
                                  aria-hidden="true"
                                />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  View Owner Details
                                </p>
                              </button>

                              <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                <div className="flex flex-1 justify-center pl-4">
                                  {/* rent again button */}
                                  <button
                                    type="button"
                                    className="text-green-600 hover:text-indigo-500"
                                  ></button>
                                </div>
                                <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                  <div className="flex flex-1 justify-center pl-4">
                                    {/* rent again button */}
                                    {booking.status === "ACCEPTED" && (
                                      <button
                                        onClick={() =>
                                          handleMarkReceived(booking.id)
                                        }
                                        type="button"
                                        className="text-green-600 hover:text-indigo-500"
                                      >
                                        Mark as received
                                      </button>
                                    )}
                                    {booking.status === "LENT" && (
                                      <>
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                                        <span className="ml-2 text-sm font-medium text-gray-500">
                                          Received
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {/* Add a review */}
                                  {booking.status === "COMPLETED" && (
                                    <>
                                      <div className=" justify-center pl-4">
                                        <button
                                          onClick={() => {
                                            rentAgain(
                                              booking.productResponse.productId
                                            );
                                          }}
                                          type="button"
                                          className="text-indigo-600 hover:text-indigo-500"
                                        >
                                          Rent Again
                                        </button>
                                      </div>
                                      <div className="flex flex-1 justify-center pl-4">
                                        <button
                                          onClick={() => {
                                            addReview(
                                              booking.productResponse.productId
                                            );
                                          }}
                                          type="button"
                                          className="text-green-600 hover:text-indigo-500"
                                        >
                                          Add a review
                                        </button>
                                        {showReviewModal ? (
                                          <>
                                            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                                              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                {/*content*/}
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-w-screen-xl">
                                                  {/*header*/}
                                                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t ">
                                                    <h3 className="text-3xl font-semibold">
                                                      Add a review
                                                    </h3>
                                                    <button
                                                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                      onClick={() =>
                                                        setShowReviewModal(
                                                          false
                                                        )
                                                      }
                                                    >
                                                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                        ×
                                                      </span>
                                                    </button>
                                                  </div>
                                                  {/* owner name, address, contact number */}
                                                  <div className=" ">
                                                    <div className="flex flex-col">
                                                      <form className="w-full max-w-lg">
                                                        <div className="flex flex-wrap ">
                                                          <div className="w-full px-3">
                                                            <label
                                                              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4"
                                                              htmlFor="grid-password"
                                                            >
                                                              Rating
                                                            </label>
                                                            <ReactStars
                                                              className="mb-3"
                                                              size={30}
                                                              value={
                                                                ratingForm.rating
                                                              }
                                                              edit={true}
                                                              onChange={(e) =>
                                                                setRatingForm({
                                                                  ...ratingForm,
                                                                  rating: e,
                                                                })
                                                              }
                                                            />
                                                            <label
                                                              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-6"
                                                              htmlFor="grid-password"
                                                            >
                                                              Review
                                                            </label>
                                                            <textarea
                                                              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                              id="grid-password"
                                                              type="text"
                                                              placeholder="Review"
                                                              onChange={(e) =>
                                                                setRatingForm({
                                                                  ...ratingForm,
                                                                  comment:
                                                                    e.target
                                                                      .value,
                                                                })
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                      </form>
                                                    </div>
                                                  </div>

                                                  {/*footer*/}
                                                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                    <button
                                                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                      type="button"
                                                      onClick={() =>
                                                        setShowReviewModal(
                                                          false
                                                        )
                                                      }
                                                    >
                                                      Close
                                                    </button>
                                                    <button
                                                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                      type="button"
                                                      onClick={() =>
                                                        handleAddReview(
                                                          booking.id
                                                        )
                                                      }
                                                    >
                                                      Add
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                          </>
                                        ) : null}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                    )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
