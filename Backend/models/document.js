const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  
  },
  metadata: {
    category: {
      type: String,
      required: true,
     
    },
    
  },
  embedding: {
    type: [Number], // Array of numbers (doubles in JavaScript)
    required: true,
    
  }
});

const Docs = mongoose.model("Document", documentSchema);

module.exports = Docs;