import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
    constructor() {
        v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImageBuffer
        (buffer: Buffer, filename: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
            return new Promise((resolve, reject) => {
                const uploadStream = v2.uploader.upload_stream(
                    {folder: 'webp-images', public_id: filename },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve(result);
                    }
                );

                Readable.from(buffer).pipe(uploadStream);
            })
    }
}