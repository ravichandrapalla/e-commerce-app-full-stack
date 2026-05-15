import cloudinary from "../config/cloudinary";

export const uploadImage = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "ecommerce",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};
