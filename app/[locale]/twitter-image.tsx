import {
  createOpenGraphImage,
  ogImageAlt,
  ogImageContentType,
  ogImageSize,
} from '@/lib/opengraph-image';

export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function TwitterImage() {
  return createOpenGraphImage();
}
