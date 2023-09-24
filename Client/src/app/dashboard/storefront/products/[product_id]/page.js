"use client";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const products = [
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-01.jpg",
    imageAlt: "TODO",
    href: "/dashboard/storefront/products/1",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-02.jpg",
    imageAlt: "TODO",
    href: "/dashboard/storefront/products/2",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-03.jpg",
    imageAlt: "TODO",
    href: "#",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg",
    imageAlt: "TODO",
    href: "#",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg",
    imageAlt: "TODO",
    href: "#",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg",
    imageAlt: "TODO",
    href: "#",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg",
    imageAlt: "TODO",
    href: "#",
  },
  // More products...
];
const Page = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    console.log(ranges);
    setSelectionRange(ranges.selection);
  };
  const { product_id } = useParams();
  const [quantityCount, setQuantityCount] = useState(1);
  const [modal, setModal] = useState(false);
  const [previewImg, setPreviewImg] = useState(
    "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
  );
  const [thumbnails, setThumbnails] = useState([
    "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
    "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-02.jpg",
  ]);

  const [images, setImages] = useState([
    "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot-01.jpg",
    "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot-02.jpg",
    "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot-03.jpg",
    "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot-04.jpg",
  ]);
  const productTitleRef = useRef();
  const productPriceRef = useRef();
  const productQuantityRef = useRef();
  const thumbnailRef = useRef();
  const modalThumbnailRef = useRef();
  const sliderRef = useRef();

  const quantity = (e) => {
    if (e.target.value === "") {
      setQuantityCount(0);
    } else {
      setQuantityCount(parseInt(e.target.value));
    }
  };
  const addCart = () => {
    let product = {
      id: product_id,
      name: productTitleRef.current.innerText,
      price: productPriceRef.current.innerText,
      quantity: productQuantityRef.current.value,
      imageSrc: previewImg,
    };
    console.log(product);
  };
  const lightBox = () => {
    setModal(true);
  };
  const previewDisplay = (e) => {
    setPreviewImg(e.target.src);
  };
  const nextSlide = () => {
    let slider = sliderRef.current;
    slider.scrollLeft += 200;
  };
  const prevSlide = () => {
    let slider = sliderRef.current;
    slider.scrollLeft -= 200;
  };

  return (
    <main className="product-container lg:flex lg:items-center lg:gap-x-12 xl:gap-x-24 lg:px-20 xl:px-40 lg:py-12 lg:m-auto lg:mt-2 lg:max-w-8xl">
      <h1 className="absolute w-1 h-1 overflow-hidden p-0 -m-1">
        Product page
      </h1>
      {modal && (
        <>
          <div className="preview xl:min-w-md max-w-3xl rounded-2xl overflow-hidden cursor-pointer">
            <img onClick={lightBox} src={previewImg} alt="product-preview" />
          </div>
          <div
            ref={thumbnailRef}
            className="thumbnails flex max-w-3xl justify-between pt-8"
          >
            {thumbnails.map((img, index) => (
              <div
                ref={modalThumbnailRef}
                key={index}
                className="cursor-pointer w-22 h-22 rounded-xl hover:opacity-80 relative overflow-hidden bg-white"
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
        </>
      )}
      <div className="mobile-slider lg:hidden">
        <div className="slider overflow-hidden relative mt-1">
          <div
            ref={sliderRef}
            className="images flex w-22 h-22 sm:w-1/2 transition-all"
          >
            {images.map((image, index) => (
              <img key={index} src={image} alt="slider-img" />
            ))}
          </div>
          <div className="directions absolute inset-x-0 inset-y-1/2 flex items-center justify-between mx-4">
            <button
              onClick={prevSlide}
              className="back-arrow w-10 h-10 bg-white rounded-full"
            ></button>
            <button
              onClick={nextSlide}
              className="next-arrow w-10 h-10 bg-white rounded-full"
            ></button>
          </div>
        </div>
      </div>
      <div className=" hidden lg:block">
        <>
          <div className="preview xl:min-w-md max-w-3xl rounded-2xl overflow-hidden cursor-pointer">
            <img onClick={lightBox} src={previewImg} alt="product-preview" />
          </div>
          <div
            ref={thumbnailRef}
            className="thumbnails flex max-w-3xl justify-between pt-8"
          >
            {thumbnails.map((img, index) => (
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
        </>{" "}
      </div>
      <section className="product-details container mx-auto px-6 pt-5 sm:pt-10 lg:pt-5 pb-20 lg:pb-5 lg:pr-0 lg:pl-7 xl:ml-1">
        <>
          <h2 className="company uppercase text-orange font-bold text-sm sm:text-md tracking-wider pb-3 sm:pb-5">
            Seller Name
          </h2>
          <h3
            ref={productTitleRef}
            className="product capitalize text-very-dark-blue font-bold text-3xl sm:text-4xl sm:leading-none pb-3"
          >
            fall limited edition
          </h3>
          <p className="text-dark-grayish-blue pb-6 lg:py-7 lg:leading-6">
            These low-profile sneakers are your perfect casual wear companion.
            Featuring a durable rubber outer sole, they'll withstand everything
            the weather can offer.
          </p>
          <div className="amount font-bold flex items-center justify-between lg:flex-col lg:items-start mb-6">
            <div className="discount-price items-center flex">
              <div ref={productPriceRef} className="price text-3xl">
                Tk.125.00
              </div>
              <div className="discount text-orange bg-pale-orange w-max px-2 rounded mx-5 h-6">
                per day
              </div>
            </div>
          </div>
          <div className="sm:flex lg:mt-8 w-full">
            <div className="">
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelect}
              />
            </div>
          </div>
          <button
            onClick={addCart}
            className="cart w-full h-10 dark:bg-orange-500 rounded-lg lg:rounded-xl mb-2 shadow-orange-shadow shadow-2xl text-white font-semibold flex items-center justify-center lg:w-2/5 hover:opacity-60"
          >
            <i className="cursor-pointer text-white text-xl leading-0 pr-3"></i>
            Send Booking Request
          </button>
        </>
      </section>
    </main>
  );
};

export default Page;
