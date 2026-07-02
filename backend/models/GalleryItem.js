import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['image', 'video'] },
  url: String,
  publicId: String,
}, { timestamps: true });

export default mongoose.model('GalleryItem', gallerySchema);
