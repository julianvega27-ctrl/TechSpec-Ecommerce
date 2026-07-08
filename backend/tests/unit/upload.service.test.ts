import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadService } from '../../src/services/upload.service.js';
import cloudinary from '../../src/utils/cloudinary.js';

// Mock Cloudinary
vi.mock('../../src/utils/cloudinary.js', () => {
  return {
    default: {
      uploader: {
        upload: vi.fn(),
      },
    },
  };
});

describe('UploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array if no files provided', async () => {
    const result = await UploadService.uploadImages([]);
    expect(result).toEqual([]);
    expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
  });

  it('should upload files and return urls and public ids', async () => {
    const mockFile1 = {
      buffer: Buffer.from('test image 1'),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const mockFile2 = {
      buffer: Buffer.from('test image 2'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    (cloudinary.uploader.upload as any).mockResolvedValueOnce({
      secure_url: 'http://cloudinary.com/img1.jpg',
      public_id: 'img1_id'
    }).mockResolvedValueOnce({
      secure_url: 'http://cloudinary.com/img2.png',
      public_id: 'img2_id'
    });

    const result = await UploadService.uploadImages([mockFile1, mockFile2], 'test_folder');

    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
    expect(cloudinary.uploader.upload).toHaveBeenNthCalledWith(1, expect.stringContaining('data:image/jpeg;base64,'), { folder: 'test_folder' });
    expect(cloudinary.uploader.upload).toHaveBeenNthCalledWith(2, expect.stringContaining('data:image/png;base64,'), { folder: 'test_folder' });

    expect(result).toEqual([
      { url: 'http://cloudinary.com/img1.jpg', publicId: 'img1_id' },
      { url: 'http://cloudinary.com/img2.png', publicId: 'img2_id' }
    ]);
  });
});
