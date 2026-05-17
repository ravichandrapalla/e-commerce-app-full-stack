import cloudinary from "../config/cloudinary";

type UploadOptions = {
  folder?: string;
};

export const uploadImage = async (
  fileBuffer: Buffer,
  options: UploadOptions = {},
) => {
  const folder = options.folder ?? "ecommerce";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};
