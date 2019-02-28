const mongoose = require('mongoose');
const Song = require('../models/song');


exports.test = (req, res) => {
    console.log(req.body);
      res.render('test')};


exports.createSong = async (req, res) => {
  try {
      console.log('in song controller')
  req.body.author = req.user._id;
  const song = new Song(req.body);
  console.log("post received: %s %s", song.title, song.artist);
  console.log(`Adding song to database ${song.title, song.artist}`)
  await song.save();   // means we won't go to line after this until save has happened 
  req.flash(`success`, `Successfully created ${song.title}`)      //success warning error
  res.redirect('/');
  }catch (err) {
      console.log(err)
    }
};



//  #TODO rewrite as async await with 
exports.getSongs = (req, res, next) => {
  Song.find()   //find is mongoose
    .then(songs => {
      // console.log(songs);
      res.render('allsongs', {
        songs: songs,
        pageTitle: 'All Songs',
        path: '/music/allsongs',
      });
    })
    .catch(err => {
      console.log(err);
    });
};





exports.getSong = (req, res, next) => {
  console.log('in getSong route');
  const songId = req.params.songId;
  Song.findById(songId)
  .then(song => {
    res.render('song-details', {
      song: song,
      pageTitle: song.title,
      title: song.title,
      artist: song.artist,
      slug: song.slug,
    });
  })
  .catch(err => console.log(err));
};






exports.editSong = (req, res, next) => {
  console.log('in editSong route');
  const songId = req.params.songId;
  Song.findById(songId)
  .then(song => {
    // console.log(song);
    res.render('song-editor', {
      song: song,
      pageTitle: 'Song Editor',
      title: song.title,
      artist: song.artist,
      lyrics: song.lyrics,
      slug: song.slug,
    });
  })
  .catch(err => console.log(err));
};

exports.postUpdateSong = (req, res, next) => {
  const songId = req.body.songId;
  const updatedTitle = req.body.title;
  const updatedArtist = req.body.artist;
  const updatedLyrics = req.body.lyrics;
  

  Song.findById(songId)
    .then(song => {
      song.title = updatedTitle;
      song.artist = updatedArtist;
      song.lyrics = updatedLyrics;
      return song.save();
    })
    .then(result => {
      console.log('UPDATED SONG!');
      res.redirect('/music/allsongs');
    })
    .catch(err => console.log(err));
};




exports.postDeleteSong = (req, res, next) => {
  const songId = req.body.songId;
  Song.findByIdAndRemove(songId)
    .then(() => {
      console.log('Song deleted');
      res.redirect('/music/allsongs');
    })
    .catch(err => console.log(err));
};
