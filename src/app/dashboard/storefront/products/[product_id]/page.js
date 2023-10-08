"use client";
import BookingService from "@/lib/services/bookingService";
import ProductService from "@/lib/services/productService";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { LinearProgress } from "@mui/material";
import { addDays } from "date-fns";
import GoogleMapReact from "google-map-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

const Page = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [owner, setOwner] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    ProductService.getOne(product_id).then((res) => {
      setLoading(false);
      setProduct(res);
      setPreviewImg(res.image1);
      res.image1 && setThumbnails([res.image1]);
      res.image2 && setThumbnails((thumbnails) => [...thumbnails, res.image2]);
      res.image3 && setThumbnails((thumbnails) => [...thumbnails, res.image3]);
      setOwner(res.owner);
    });
  }, [product_id]);

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    console.log(ranges.selection);
    setSelectionRange(ranges.selection);
  };

  const [thumbnails, setThumbnails] = useState([]);

  const thumbnailRef = useRef();
  const modalThumbnailRef = useRef();

  const previewDisplay = (e) => {
    setPreviewImg(e.target.src);
  };

  const handleRequest = () => {
    const data = {
      productId: product.productId,
      rentFrom: selectionRange.startDate,
      rentTo: selectionRange.endDate,
    };
    setLoading(true);
    BookingService.createBooking(data)
      .then((res) => {
        setLoading(false);
        toast.success("Booking request sent successfully");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <>
      {/* progress bar loader */}
      {loading && <LinearProgress />}
      {product && (
        <main className="product-container lg:flex lg:items-center lg:gap-x-12 xl:gap-x-24 lg:px-20 xl:px-40 lg:py-12 lg:m-auto lg:mt-2 lg:max-w-8xl">
          <h1 className="absolute w-1 h-1 overflow-hidden p-0 -m-1">
            Product page
          </h1>
          <div className="  lg:block">
            <>
              <div className="preview xl:min-w-md max-w-3xl rounded-xl overflow-hidden cursor-pointer">
                <img src={previewImg} alt="product-preview" />
              </div>
              <div
                ref={thumbnailRef}
                className="thumbnails flex max-w-3xl justify-between pt-8"
              >
                {thumbnails &&
                  thumbnails.length > 1 &&
                  thumbnails.map((img, index) => (
                    <div
                      ref={modalThumbnailRef}
                      key={index}
                      className="cursor-pointer w-15 h-15 p-4 rounded-xl hover:opacity-80 relative overflow-hidden bg-white"
                    >
                      <img
                        id={index}
                        onClick={previewDisplay}
                        className="w-full"
                        src={img}
                        alt="thumbnail"
                      />
                    </div>
                  ))}
              </div>
              {/* Location */}
              <div className="location flex items-center justify-between lg:flex-col lg:items-start mb-6 w-full h-60">
                <i className="fas fa-map-marker-alt"></i>{" "}
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
                  }}
                  defaultCenter={{
                    lat: 23.777176,
                    lng: 90.399452,
                  }}
                  defaultZoom={12}
                  className="h-screen"
                  center={
                    (owner.lat && { lat: owner.lat, lng: owner.lng }) || {
                      lat: 23.777176,
                      lng: 90.399452,
                    }
                  }
                  yesIWantToUseGoogleMapApiInternals={true}
                >
                  <div
                    lat={owner.lat}
                    lng={owner.lng}
                    className="w-32 h-32 bg-red-500 rounded-full border-2 border-red-500  bg-opacity-50"
                  ></div>
                </GoogleMapReact>
              </div>
            </>
          </div>
          <section className="product-details container mx-auto px-6 pt-5 sm:pt-10 lg:pt-5 pb-20 lg:pb-5 lg:pr-0 lg:pl-7 xl:ml-1">
            <>
              <h2 className="company uppercase text-orange font-bold text-sm sm:text-md tracking-wider pb-3 sm:pb-5">
                Owner : {owner.fullName}
                {owner && owner.verified && owner.emailVerified && (
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 inline mx-3" />
                )}
              </h2>
              <h3 className="product capitalize text-very-dark-blue font-bold text-3xl sm:text-4xl sm:leading-none pb-3">
                {product.name}
              </h3>
              <p className="text-dark-grayish-blue pb-6 lg:py-7 lg:leading-6">
                {product.description}
              </p>
              {/* market value */}
              <div className="market-value flex items-center justify-between lg:flex-col lg:items-start mb-6">
                <div className=" text-lg text-gray-700 font-semibold ">
                  Market Value Tk. {product.marketPrice}
                </div>
              </div>
              {/* Base price */}
              <div className="base-price flex items-center justify-between lg:flex-col lg:items-start mb-6">
                <div className=" text-lg text-red-700 font-semibold ">
                  Base Price Tk. {product.basePrice}
                </div>
              </div>

              {/* Rating stars*/}
              <div className="rating flex items-center justify-between lg:flex-col lg:items-start mb-6">
                <div className="text-lg text-gray-500">
                  <ReactStars size={30} value={product.rating} edit={false} />
                </div>
              </div>
              <div className="amount font-bold flex items-center justify-between lg:flex-col lg:items-start mb-6">
                <div className="discount-price items-center flex">
                  <div className="price text-3xl">
                    Tk. {product.perDayPrice}
                  </div>
                  <div className="discount text-orange-700 bg-pale-orange w-max px-2 rounded mx-5 h-6">
                    per day
                  </div>
                </div>
              </div>
              <div className="sm:flex lg:mt-8 w-full">
                <div className=" hidden lg:block">
                  <DateRange
                    editableDateInputs={true}
                    months={2}
                    moveRangeOnFirstSelection={false}
                    minDate={addDays(new Date(), -0)}
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    direction="horizontal"
                  />
                </div>
                <div className=" lg:hidden">
                  <DateRange
                    editableDateInputs={true}
                    months={1}
                    moveRangeOnFirstSelection={false}
                    minDate={addDays(new Date(), -0)}
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    direction="vertical"
                  />
                </div>
              </div>
              {/* Estimated Rent Total and Send Reuqest button */}
              <div className="flex  mb-6">
                <div>
                  <div className="text-lg text-gray-500">
                    Estimated Rent Total
                  </div>
                  <div className="amount font-bold">
                    <div className="price text-3xl">
                      Tk.{" "}
                      {product.basePrice +
                        product.perDayPrice *
                          Math.ceil(
                            (selectionRange.endDate -
                              selectionRange.startDate) /
                              (1000 * 3600 * 24)
                          )}
                    </div>
                  </div>
                </div>
                {/* button */}
                <div className="m-5">
                  <button
                    onClick={handleRequest}
                    className="bg-orange-500 text-white font-bold py-2 px-8 ml-4" // Add ml-4 to add left margin
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </>
          </section>
        </main>
      )}
    </>
  );
};

export default Page;
