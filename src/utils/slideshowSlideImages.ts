const characterSlideshowUrlBase =
  'https://res.cloudinary.com/all-about-erik/image/upload/f_auto/v1755035738/OldTimeSportsmen%20Site/Homepage/Character%20Slideshows/';
const numberOfSlides = 34;

export function getSlideshowSlides(startNum: number) {
  return Array.from({ length: numberOfSlides }, (_, i) => ({
    img: `${characterSlideshowUrlBase}Layer_${Number(
      startNum + i <= numberOfSlides
        ? startNum + i
        : startNum + i - numberOfSlides
    )
      .toString()
      .padStart(2, '0')}.png`,
  }));
}
