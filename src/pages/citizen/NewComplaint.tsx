import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Camera, MapPin, Send, X, Loader2 } from 'lucide-react';

const NewComplaint: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [imageLocation, setImageLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        setIsGettingLocation(true);

        // Send to Flask for prediction
        const response = await fetch(' http://192.168.1.2:5000/predict', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        const predictions = result.predictions;

      if (predictions && predictions.length > 0) {
        const predictedClass = predictions[0].class;

        if (predictedClass === 'potholes') {
          setDepartment('BBMP');
        } else if (predictedClass === 'dog') {
          setDepartment('ANIMAL_WELFARE');
        } else {
          setError('Unknown category. Please upload a clear image of a pothole or stray dog.');
          return;
        }
      } else {
        setError('No class found in image.');
        return;
      }


        // Optional: preview uploaded image
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);

        // Get location
        //const position = await getCurrentPosition();
        //setImageLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        //const address = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        //setLocation(address);

      } catch (err) {
        console.error('Error uploading or predicting:', err);
        setError('Error uploading image or predicting department.');
      } finally {
        setIsGettingLocation(false);
      }
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E, Bangalore, Karnataka`;

  };

  const handleGetLocation = async () => {
    try {
      setIsGettingLocation(true);
      const position = await getCurrentPosition();
      const address = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
      setLocation(address);
      setImageLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Could not get location. Please enter it manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !image || !location || !department) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (user) {
        addComplaint({
          userId: user.id,
          title,
          description,
          image,
          location,
          department,
          coordinates: imageLocation ? {
            latitude: imageLocation.lat,
            longitude: imageLocation.lng
          } : undefined
        });

        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError('An error occurred while submitting your complaint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Submit a New Complaint
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Please provide details about the civic issue you're reporting.
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Complaint Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="E.g., Stray dog spotted near market"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Please provide a detailed description of the issue..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <div className="mt-1 flex items-center">
                    {image ? (
                      <div className="relative">
                        <img 
                          src={image} 
                          alt="Complaint" 
                          className="h-32 w-32 object-cover rounded-lg shadow-md" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage('');
                            setDepartment('');
                            setImageLocation(null);
                          }}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 shadow-sm"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Camera size={16} className="mr-2" />
                          Upload Photo
                        </label>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Please upload a clear image of a pothole or a stray dog. The department will be assigned automatically.
                  </p>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Address of the issue"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 sm:text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isGettingLocation ? (
                        <Loader2 size={16} className="animate-spin mr-2" />
                      ) : (
                        <MapPin size={16} className="mr-2" />
                      )}
                      {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                    </button>
                  </div>
                  {imageLocation && (
                    <p className="mt-2 text-sm text-gray-500">
                      Coordinates: {imageLocation.lat.toFixed(4)}°N, {imageLocation.lng.toFixed(4)}°E
                    </p>
                  )}
                </div>

                {department && (
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Assigned Department: {department === 'BBMP' ? 'BBMP (Municipal Corporation)' : 'Animal Welfare'}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewComplaint;