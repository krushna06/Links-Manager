import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this link.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  link: {
    type: String,
    required: [true, 'Please provide the URL for this link.'],
    maxlength: [500, 'URL cannot be more than 500 characters'],
  },
  user: {
    type: String,
    required: [true, 'Please provide the user ID for this link.'],
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
});

export default mongoose.models.Link || mongoose.model('Link', LinkSchema, 'Link Manager');

