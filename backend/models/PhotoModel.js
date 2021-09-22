const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
    {
      caption: { type: String },
      image: { type: String, required: true },
      likes: [String],
      comments: [{
          comment: { type: String },
          name: { type: String },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    
      }],
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    
    },
    {
      timestamps: true,
    }
  );
  
  const Photo = mongoose.model('Photo', photoSchema);
  
  // export default Product;
  module.exports = Photo;