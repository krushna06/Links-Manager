import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.Link || mongoose.model('Link', LinkSchema);
