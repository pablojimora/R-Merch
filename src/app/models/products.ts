import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true,
    default: 0
  },

  images: {
    type: [String],
    default: []
  },

  ownerId: {
    type: String,
    required: true
  },

  isOfficial: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);