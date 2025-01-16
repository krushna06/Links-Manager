import mongoose from 'mongoose';

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this folder.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  user: {
    type: String,
    required: [true, 'Please provide the user ID for this folder.'],
  },
});

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema, 'Folders');

