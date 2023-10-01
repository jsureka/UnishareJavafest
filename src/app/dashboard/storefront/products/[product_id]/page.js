"use client";
import BookingService from "@/lib/services/bookingService";
import ProductService from "@/lib/services/productService";
import UserService from "@/lib/services/userService";
import { addDays } from "date-fns";
import GoogleMapReact from "google-map-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  const [previewImg, setPreviewImg] = useState(
    "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
  );
  const [owner, setOwner] = useState({});
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    ProductService.getOne(product_id).then((res) => {
      setProduct(res);
      setPreviewImg(res.image1);
      res.image1 && setThumbnails([res.image1]);
      res.image2 && setThumbnails((thumbnails) => [...thumbnails, res.image2]);
      res.image3 && setThumbnails((thumbnails) => [...thumbnails, res.image3]);
      UserService.getOne(res.ownerId).then((res) => {
        setOwner(res);
      });
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
    BookingService.createBooking(data)
      .then((res) => {
        toast.success("Booking request sent successfully");
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <>
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
                  onGoogleApiLoaded={({ map, maps }) => {
                    new maps.Circle({
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.35,
                      map,
                      center: {
                        lat: owner.lat,
                        lng: owner.lng,
                      },
                      radius: 2000,
                    });
                  }}
                ></GoogleMapReact>
              </div>
            </>
          </div>
          <section className="product-details container mx-auto px-6 pt-5 sm:pt-10 lg:pt-5 pb-20 lg:pb-5 lg:pr-0 lg:pl-7 xl:ml-1">
            <>
              <h2 className="company uppercase text-orange font-bold text-sm sm:text-md tracking-wider pb-3 sm:pb-5">
                Owner {product.ownerId}
              </h2>
              <h3 className="product capitalize text-very-dark-blue font-bold text-3xl sm:text-4xl sm:leading-none pb-3">
                {product.name}
              </h3>
              <p className="text-dark-grayish-blue pb-6 lg:py-7 lg:leading-6">
                {product.description}
              </p>
              {/* market value */}
              <div className="market-value flex items-center justify-between lg:flex-col lg:items-start mb-6">
                <div className=" text-lg text-gray-500">
                  Market Value Tk. {product.basePrice}
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
              <button
                onClick={handleRequest}
                className="cart w-full h-10 dark:bg-orange-500 rounded-md lg:rounded-lg mb-2 shadow-orange-shadow shadow-2xl text-white font-semibold flex items-center justify-center lg:w-2/5 hover:opacity-60 mt-3 md:mx-3"
              >
                <i className="cursor-pointer text-white text-xl leading-0 pr-3"></i>
                Send Booking Request
              </button>
            </>
          </section>
        </main>
      )}
    </>
  );
};

export default Page;
