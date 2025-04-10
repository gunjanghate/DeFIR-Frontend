"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface OCRData {
  [key: string]: any;
}

interface VerificationResult {
  isAuthentic: boolean;
  confidence: string;
  findings: string[];
  securityIssues: string | Record<string, any> | Record<string, any>[];
  ocrData: OCRData;
  ocrMatchResults: Record<string, string>;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const VerifyAadhar: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationAvailable, setLocationAvailable] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          localStorage.setItem("userLocation", JSON.stringify(coords));
          setUserLocation(coords);
          setLocationAvailable(true);
        },
        (error) => {
          console.warn("Location access denied or unavailable:", error);
          setLocationAvailable(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setLocationAvailable(false);
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setVerificationResult(null);
    
    // Create preview URL for the selected image
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    const location = localStorage.getItem("userLocation");
    if (!location) {
      alert("Location data not available. Please enable location access and try again.");
      return;
    }

    const parsedLocation = JSON.parse(location);
    setUserLocation(parsedLocation);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(",")[1];

      try {
        setLoading(true);

        const response = await axios.post<VerificationResult>(
          "http://localhost:5000/api/verify-aadhar",
          {
            image: base64Image,
            location: parsedLocation,
          }
        );

        setVerificationResult(response.data);
      } catch (error) {
        console.error("Error verifying Aadhar:", error);
        alert("Verification failed. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-200 via-white to-green-200 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mt-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-200 px-6 py-4">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="M15 8h2" />
                <path d="M15 12h2" />
                <path d="M7 16h10" />
              </svg>
              Aadhar Card Verification
            </h2>
            <p className="text-green-200 mt-1">Upload your Aadhar card for secure verification</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-200 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {!previewUrl ? (
                    <div className="space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">Click to upload Aadhar image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Aadhar preview" 
                        className="max-h-64 mx-auto rounded-lg shadow-md" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-medium">Click to change</p>
                      </div>
                    </div>
                  )}
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {!locationAvailable && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Location access is required. Please allow location permission in your browser.</span>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={!selectedFile || loading || !locationAvailable}
                className="w-full mt-6 px-4 py-3 bg-green-200 text-black font-medium rounded-lg shadow hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verify Aadhar
                  </span>
                )}
              </button>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Verification Result</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Authentication Status */}
                  <div className="flex justify-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                      verificationResult.isAuthentic 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {verificationResult.isAuthentic ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="font-medium">
                        {verificationResult.isAuthentic ? "Authentic Document" : "Not Authentic"}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            parseFloat(verificationResult.confidence) > 80 
                              ? "bg-green-600" 
                              : parseFloat(verificationResult.confidence) > 50 
                                ? "bg-yellow-500" 
                                : "bg-red-600"
                          }`} 
                          style={{ width: `${verificationResult.confidence}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-xl font-bold">{verificationResult.confidence}%</span>
                    </div>
                  </div>

                  {/* Location Information */}
                  {userLocation && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Verification Location</p>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600">
                          {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 text-green-200 hover:text-green-200 text-sm flex items-center"
                        >
                          View on Google Maps
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* FIR Button */}
                  {parseFloat(verificationResult.confidence) > 70 && (
                    <div className="pt-4">
                      <Link href="/complaints/new" className="block w-full">
                        <button
                          className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 011-1h.5a.5.5 0 000-1H6a1 1 0 00-1 1v1H4a1 1 0 110-2h1V6z" clipRule="evenodd" />
                          </svg>
                          File FIR Report
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secure verification powered by advanced document authentication technology</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAadhar;