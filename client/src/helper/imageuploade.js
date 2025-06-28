import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const imageuploade = async (files) => {
  const urls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      urls.push(res.data.secure_url);
    } catch (error) {
      console.error("Upload failed for:", file.name, error.message);
      continue;
    }
  }

  return urls;
};
