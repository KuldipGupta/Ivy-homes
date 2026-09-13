import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  listingId: {
    type: String,
    required: true,
    trim: true
  },
  listingData: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

favouriteSchema.index({ userEmail: 1, listingId: 1 }, { unique: true });

export const Favourite = mongoose.model('Favourite', favouriteSchema);
