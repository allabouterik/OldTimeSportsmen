import type { CloudinaryImage } from '@/types/CloudinaryTypes';

export type CloudinaryImageWithCaption = CloudinaryImage & {
  img: string;
  caption?: string;
  htmlCaption?: string;
  postmark?: string;
  mainText?: string;
};

export const getImageNumber = (image: CloudinaryImage): number => {
  const parts = image.public_id.split('_');
  const lastPart = parts.pop();
  if (!lastPart) return 0; // or handle the error as needed
  const numberPart = lastPart.replace(/[a-zA-Z]+$/, ''); // Remove any trailing letters
  const number = parseInt(numberPart, 10);
  return isNaN(number) ? 0 : number; // Return 0 if parsing fails
};

export const getImageId = (image: CloudinaryImage): string =>
  image.public_id.split('/').pop()?.split('_').slice(-1).join(' ') || '';

export const getImageTitle = (image: CloudinaryImage): string =>
  image.public_id.split('/').pop()?.split('_').slice(-2).join(' ') || '';

export const isPostcardBackImg = (public_id: string) =>
  public_id.endsWith('a') || public_id.endsWith('a2');
