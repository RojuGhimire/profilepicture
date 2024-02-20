import React, { useState } from "react";

const ProfilePictureUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
    }
  };

  const handleUpload = () => {
    // Implement upload logic here
    if (image) {
      // Use FormData to append image data and send it to the server
      const formData = new FormData();
      formData.append("profilePicture", image);
      // Make a fetch request to upload the image
      fetch("YOUR_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // Handle response from server
        })
        .catch((error) => {
          // Handle error
        });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="profile-picture-input"
      />
      <label
        htmlFor="profile-picture-input"
        className="cursor-pointer border border-gray-300 rounded-md p-2"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Profile Picture Preview"
            className="w-32 h-32 object-cover rounded-full"
          />
        ) : (
          <span>Select a profile picture</span>
        )}
      </label>
      <button
        onClick={handleUpload}
        disabled={!image}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Upload
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
