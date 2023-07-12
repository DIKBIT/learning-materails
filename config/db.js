const mongoose = require('mongoose');
const config = require('config');
const db = "mongodb+srv://naman1:naman1@cluster0.uk7kr.mongodb.net/?retryWrites=true&w=majority";
console.log(db);

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
