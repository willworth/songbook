const mongoose = require('mongoose');
const slug = require('slugs');


// do all of your data normalisation as close to the model as possible

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please enter a song name'  //this works as err and true
    },
    artist: {
        type: String,
        trim: true,
        required: 'Please enter an artist name'  //this works as err and true
    },
    slug: String,
    lyrics: {
        type: String,
        trim: true,
        required: 'Please enter the lyrics or chords'  //this works as err and true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
      }
});

// this is a pre save hook to generate the slug...

songSchema.pre('save', function(next){
    if (!this.isModified('title')){
        next();
        return;
    }
    this.slug = slug(this.title);
    next();
    //TODO make resilient for unique slugs
})


module.exports = mongoose.model('Song', songSchema);

