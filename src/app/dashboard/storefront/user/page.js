"use client";
import ImageUpload from "@/components/GlobalComponents/ImageUpload/ImageUpload";
import AuthService from "@/lib/services/authService";
import UniversityService from "@/lib/services/universityService";
import UserService from "@/lib/services/userService";
import userSlice from "@/store/Slices/userSlice";
import { CogIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button, Step, Stepper, Typography } from "@material-tailwind/react";
import GoogleMapReact from "google-map-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [univserities, setUniversities] = useState([]);
  const [idCardImage, setIdCardImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    password: "",
    address: "",
    phoneNumber: "",
    otp: "",
    lat: 0,
    lng: 0,
    idCard: "",
    profilePicture: "",
    blocked: false,
    verified: false,
    emailVerified: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission with formData
    UserService.update(formData)
      .then((res) => {
        userSlice.actions.setUser(res);
        userSlice.actions.setIsAuthenticated(true);
        toast.success("User updated successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleIdCardUpload = (image) => {
    setIdCardImage(image);
  };

  const handleProfileUpload = (image) => {
    setProfileImage(image);
  };

  const handleMapClick = (event) => {
    setUserLocation({
      lat: event.lat,
      lng: event.lng,
    });
  };

  const sendVerificationEmail = () => {
    AuthService.sendVerificationEmail()
      .then((res) => {
        toast.success("Email sent successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const emailVerify = () => {
    const data = {
      otp: formData.otp,
      email: user.email,
    };
    AuthService.verifyEmail(data).then((res) => {
      toast.success("Email verified successfully");
    });
  };

  const autoVerify = () => {
    UserService.autoVerify()
      .then((res) => {
        toast.success(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    // UserService.getOne(user?.id)
    //   .then((res) => {
    //     userSlice.actions.setUser(res);
    //     setFormData(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    UniversityService.getAll()
      .then((res) => {
        setUniversities(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <div className="bg-gray-100">
        <section class=" p-9">
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            {/* create a card with two inputs in two columns, uplaod image , upload id card */}
            <div class="w-full px-9 py-6 mx-auto bg-white rounded-lg border shadow-lg border-gray-400  lg:w-1/2">
              {user && (
                <div className="w-full py-4 px-8 my-4">
                  <Stepper
                    className=" bg-orange-100 rounded-xl"
                    activeStep={activeStep}
                  >
                    <Step
                      onClick={() => {
                        setActiveStep(0);
                      }}
                    >
                      <HomeIcon className="p-2" />
                      <div className="absolute -bottom-[2.5rem] w-max text-center">
                        <Typography
                          variant="h6"
                          className=" text-gray-600 text-center"
                        >
                          User Details
                        </Typography>
                      </div>
                    </Step>
                    <Step
                      onClick={() => {
                        setActiveStep(1);
                      }}
                    >
                      <UserIcon className="p-2" />
                      <div className="absolute -bottom-[2.5rem] -right-[0.5rem] w-max">
                        <Typography
                          variant="h6"
                          className=" text-gray-600 text-center"
                        >
                          Verify Image
                        </Typography>
                      </div>
                    </Step>
                    <Step
                      onClick={() => {
                        if (user.emailVerified) {
                          toast.success("Email already verified");
                          return;
                        }
                        sendVerificationEmail();
                        setActiveStep(2);
                      }}
                    >
                      <CogIcon className="p-2" />
                      <div className="absolute -bottom-[2.5rem] -right-[0.5rem] w-max text-center">
                        <Typography variant="h6" className=" text-gray-600">
                          Verify Email
                        </Typography>
                      </div>
                    </Step>
                  </Stepper>
                </div>
              )}
              <form
                class="mt-6"
                action="#"
                method="POST"
                onSubmit={handleSubmit}
              >
                {activeStep === 0 && user && (
                  <div className=" ">
                    <div class="flex flex-wrap mb-6 -mx-3">
                      <div class="w-full px-3 mb-6  md:mb-0 mt-10">
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
                          name="fullName"
                          value={user.fullName}
                          readOnly
                          onChange={(e) =>
                            setuser({
                              ...formData,
                              fullName: e.target.value,
                            })
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
                          readOnly
                          value={user.email}
                          onChange={(e) =>
                            setUser({
                              ...formData,
                              email: e.target.value,
                            })
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
                          readOnly
                          value={user.university}
                          onChange={(e) =>
                            setUser({
                              ...formData,
                              university: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled selected>
                            Select your university
                          </option>
                          {univserities.map((university) => (
                            <option value={university.id}>
                              {university.universityName}
                            </option>
                          ))}
                        </select>
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
                          readOnly
                          value={user.address}
                          onChange={(e) =>
                            setuser({
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
                          readOnly
                          placeholder="123-456-7890"
                          required
                          value={user.phoneNumber}
                          onChange={(e) =>
                            setuser({
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
                            lat: 23.99,
                            lng: 90.11,
                          }}
                          defaultZoom={12}
                          center={{
                            lat: user.lat,
                            lng: user.lng,
                          }}
                          className="h-screen	"
                        >
                          {user && (
                            <div lat={user.lat} lng={user.lng}>
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
                {activeStep === 1 && (
                  <div className="">
                    <div class="flex flex-wrap mb-6 -mx-3">
                      <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0 mt-10">
                        <label
                          class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                          for="grid-first-name"
                        >
                          ID Card
                        </label>
                        <ImageUpload
                          label="ID Card"
                          onImageChange={handleIdCardUpload}
                          currentImage={user.idCard}
                        />
                      </div>
                      <div class="w-full px-3 md:w-1/2 mt-10">
                        <label
                          class="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black"
                          for="grid-last-name"
                        >
                          Profile Picture
                        </label>
                        <ImageUpload
                          label="Profile Picture"
                          onImageChange={handleProfileUpload}
                          currentImage={user.profilePicture}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* verfiy email address */}
                {activeStep === 2 && (
                  <div>
                    <div className="flex flex-wrap mb-6 -mx-3 mt-10">
                      <div className="w-full px-3 mb-6 md:mb-0">
                        <p className="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black text-center">
                          Please verify your email address
                        </p>
                        <p className="block mb-2 text-md font-bold tracking-wide text-gray-700 uppercase dark:text-black text-center">
                          An OTP has been sent to your email address
                        </p>
                        {/* Enter OTP and verify*/}
                        <div class="flex flex-wrap mt-6 -mx-3">
                          <div class="w-full px-3 mb-6 md:w-2/3 md:mb-0">
                            <input
                              className="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:border-purple-400 dark:focus:border-purple-400 focus:outline-none focus:ring"
                              id="grid-first-name"
                              type="text"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  otp: e.target.value,
                                })
                              }
                              placeholder="Enter OTP here"
                            />
                          </div>
                          <div className="w-full px-3 mb-6 md:w-1/3 md:mb-0">
                            <button
                              onClick={emailVerify}
                              class="block w-full px-4 py-3 mb-3 text-gray-700 bg-white border border-gray-600 rounded-lg hover:bg-slate-800 hover:text-white focus:outline-none focus:ring"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                        {/* Did not get OTP? CLick here to resend, center one liner */}
                        <div className="flex flex-wrap mt-6 -mx-3">
                          <div className="w-full px-3 mb-6 md:mb-0">
                            <p className="block mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-black text-center">
                              Did not get OTP?
                              <a href="#" className="text-blue-600  px-2">
                                Click here to resend
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
              <div className="mt-16 flex justify-center">
                {activeStep === 1 && (
                  <Button
                    className=" outline outline-1 bg-slate-200 text-black mx-2"
                    onClick={autoVerify}
                  >
                    Verify
                  </Button>
                )}

                {activeStep === 1 ? (
                  <Button onClick={handleSubmit}>Update</Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>{" "}
    </div>
  );
};

export default Page;
