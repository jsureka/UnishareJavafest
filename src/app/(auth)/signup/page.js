"use client";

import ImageUpload from "@/components/GlobalComponents/ImageUpload/ImageUpload";
import AuthService from "@/lib/services/authService";
import UniversityService from "@/lib/services/universityService";
import { setUniversity } from "@/store/Slices/universitySlice";
import { Button } from "@material-tailwind/react";
import GoogleMapReact from "google-map-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function SignUp() {
  const availableUniversities = useSelector(
    (state) => state.university.university
  );
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 23.777176,
    lng: 90.399452,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    idCardImage: "",
    profileImage: "",
    otp: "",
    role: "USER",
  });
  const handleNext = () => {
    if (activeStep === 0) {
      // if required fields not filled, return
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.university ||
        !formData.password ||
        !formData.address ||
        !formData.phoneNumber
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      // if password and confirm password do not match, return
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setActiveStep(1);
    }
    if (activeStep === 1) {
      // if required fields not filled, return
      if (!idCardImage || !profileImage) {
        toast.error("Please upload all required images");
        return;
      }
      setActiveStep(2);
    }
  };

  const emailVerify = () => {
    const data = {
      email: formData.email,
      otp: formData.otp,
    };
    AuthService.verifyEmail(data)
      .then((res) => {
        toast.success("Verification successful");
        router.push("/dashboard/storefront/home");
      })
      .catch((err) => {
        toast.error("Verification failed");
      });
  };

  const autoVerify = () => {
    const data = new FormData();
    data.append("idCard", idCardImage);
    data.append("profilePicture", profileImage);
    data.append("universityId", formData.university);
    AuthService.autoVerify(data)
      .then((res) => {
        toast.success("Verification successful");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Verification failed");
      });
  };

  // Function to handle map click event
  const handleMapClick = ({ x, y, lat, lng, event }) => {
    // Update the state with the clicked coordinates
    console.log({ x, y, lat, lng, event });
    setUserLocation({ lat, lng });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("university", formData.university);
    data.append("password", formData.password);
    data.append("address", formData.address);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("idCard", idCardImage);
    data.append("profilePicture", profileImage);
    data.append("role", formData.role);
    data.append("lat", userLocation.lat);
    data.append("lng", userLocation.lng);

    AuthService.register(data)
      .then((res) => {
        toast.success("Registration successful");
        router.push("/login");
        // setActiveStep(1);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  // Function to handle ID card image upload
  const handleIdCardUpload = (file) => {
    setIdCardImage(file);
  };

  // Function to handle profile image upload
  const handleProfileUpload = (file) => {
    setProfileImage(file);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    // Get the user's location when the component mounts
    if (availableUniversities === null) {
      UniversityService.getAll().then((res) => {
        dispatch(setUniversity(res.data));
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  return (
    <div className="bg-gray-100">
      <section class=" p-9">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          {/* create a card with two inputs in two columns, uplaod image , upload id card */}
          <div class="w-full px-9 py-6 mx-auto bg-white rounded-lg border shadow-lg border-gray-400  lg:w-1/2">
            <Link
              href="/dashboard/storefront/home"
              class="flex justify-center items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-black"
            >
              <img
                class="w-8 h-8 mr-2"
                src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
                alt="logo"
              />
              UniShare
            </Link>
            <h2 class=" text-2xl  text-center text-gray-800">Sign Up</h2>
            <form class="mt-6" onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <div>
                  <div class="flex flex-wrap mb-6 -mx-3">
                    <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-first-name"
                      >
                        ID Card
                      </label>
                      <ImageUpload
                        label="ID Card"
                        onImageChange={handleIdCardUpload}
                        currentImage={idCardImage}
                      />
                    </div>
                    <div class="w-full px-3 md:w-1/2">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-last-name"
                      >
                        Profile Picture
                      </label>
                      <ImageUpload
                        label="Profile Picture"
                        onImageChange={handleProfileUpload}
                        currentImage={profileImage}
                      />
                    </div>
                  </div>
                  <div class="flex flex-wrap mb-6 -mx-3">
                    <div class="w-full px-3 mb-6  md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-first-name"
                      >
                        Full Name*
                      </label>
                      <input
                        class="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-first-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div class="flex flex-wrap mb-6 -mx-3">
                    <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-first-name"
                      >
                        Email Address*
                      </label>
                      <input
                        class="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-first-name"
                        type="text"
                        required
                        placeholder="abc@gmail.com"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-last-name"
                      >
                        University*
                      </label>
                      <select
                        class="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-last-name"
                        type="text"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            university: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled selected>
                          Select your university
                        </option>
                        {availableUniversities?.map((university) => (
                          <option value={university.id}>
                            {university.universityName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div class="flex flex-wrap mb-6 -mx-3">
                    <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-first-name"
                      >
                        Password*
                      </label>
                      <input
                        class="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-first-name"
                        type="password"
                        placeholder="********"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                    <div class="w-full px-3 md:w-1/2">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-last-name"
                      >
                        Confirm Password*
                      </label>
                      <input
                        class="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-last-name"
                        type="password"
                        placeholder="********"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* address one line and phone */}
                  <div class="flex flex-wrap mb-6 -mx-3">
                    <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-first-name"
                      >
                        Address*
                      </label>
                      <input
                        class="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-first-name"
                        type="text"
                        placeholder="123 Street Name"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="w-full px-3 md:w-1/2">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-last-name"
                      >
                        Phone Number*
                      </label>
                      <input
                        class="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                        id="grid-last-name"
                        type="text"
                        placeholder="123-456-7890"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* location */}
                    <div class="w-full px-3 h-60	">
                      <label
                        class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                        for="grid-last-name"
                      >
                        Location
                      </label>
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
                        center={userLocation} // Center the map on the user's location
                        className="h-screen	"
                        onClick={handleMapClick} // Attach the click event handler
                      >
                        {userLocation && (
                          <div lat={userLocation.lat} lng={userLocation.lng}>
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
                </div>
              )}
              <div className="mt-16 flex justify-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
