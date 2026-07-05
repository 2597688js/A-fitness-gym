import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiEndpoint } from '../config/api';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.JPG';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';

const SLIDE_INTERVAL_MS = 5000;
const MAX_SLIDES = 4;

const gymImages = [img1, img2, img3, img4];

const buildFallbackSlides = () =>
  gymImages.map((url, i) => ({
    id: `gym-${i}`,
    url,
    title: 'A Fitness Gym by Amit Hussain',
  }));

export default function HeroSlider() {
  const [slides, setSlides] = useState(() => buildFallbackSlides());
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let images = [];
      try {
        const { data } = await axios.get(getApiEndpoint('/api/gallery'));
        images = (data || []).filter(item => item.type === 'image').slice(0, MAX_SLIDES);
      } catch (err) {
        console.error('HeroSlider: gallery fetch failed, using fallback images', err.message);
      }
      const padded = [...images];
      let i = 0;
      while (padded.length < MAX_SLIDES) {
        padded.push({ id: `gym-${i}`, url: gymImages[i % gymImages.length], title: 'A Fitness Gym' });
        i += 1;
      }
      if (!cancelled) setSlides(padded);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id ?? slide.url}
          className={`hero-slider__slide${index === current ? ' hero-slider__slide--active' : ''}`}
          style={{ backgroundImage: `url(${slide.url})` }}
        />
      ))}
      {slides.length > 1 && (
        <div className="hero-slider__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? slide.url}
              type="button"
              className={`hero-slider__dot${index === current ? ' hero-slider__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
