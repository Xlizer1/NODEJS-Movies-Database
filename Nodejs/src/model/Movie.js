import mongoose from 'mongoose';


//define schema and model
const Schema = mongoose.Schema;

const MovieScema = new Schema({
  title: String,
  year: Number,
  cast: [String],
  genres: [String]
});

const MovieModel = mongoose.model('Movies', MovieScema);

export default MovieModel;