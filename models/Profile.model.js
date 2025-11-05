const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
    ref: 'User'
  },
  preferences: {
    genres: [String],
    authors: [String]
  },
  history: [{
    book: String,
    rating: Number,
    comment: String,
    dateRead: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
