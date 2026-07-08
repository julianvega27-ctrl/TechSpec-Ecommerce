import cloudinary from '../utils/cloudinary.js';

export class UploadService {
  /**
   * Uploads multiple multer files to Cloudinary.
   * @param files Array of Express.Multer.File
   * @param folder Cloudinary folder name
   * @returns Promise resolving to array of { url, publicId }
   */
  static async uploadImages(files: Express.Multer.File[], folder: string = 'techspec_products'): Promise<{ url: string; publicId: string }[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: folder
        });
        return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
      })
    );

    return uploadedImages;
  }
}
