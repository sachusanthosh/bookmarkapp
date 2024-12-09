const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true 
  },
},
{timestamps:true}
);

bookmarkSchema.plugin(mongoosePaginate);


const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;