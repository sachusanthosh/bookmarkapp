const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Bookmark = require('./models/bookmark');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/bookMarkApp').then((e)=>{
  console.log('MongoDb is connected');
})

//route handlers
const userRoute = require('./routes/user');
const bookmarkRoute = require('./routes/bookmark');


//middlewares
const { cookieAuthentication } = require('./middleware/authenticate');


// Views Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cookieAuthentication("token"));



app.get('/', async (req, res)=>{
  // const bookmarks = await Bookmark.find({});
  // res.render('home',{
  //   bookmarks: bookmarks,
  //   user: req.user,
  // });

  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page query param
  const limit = 2; // Display 2 bookmarks per page

  try {
    const bookmarks = await Bookmark.paginate({}, { page, limit });
    
    res.render('home', {
      bookmarks: bookmarks.docs,  // Paginated bookmarks
      user: req.user,
      currentPage: page,
      totalPages: bookmarks.totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching bookmarks");
  }

})
app.use('/user', userRoute);
app.use('/bookmark', bookmarkRoute);



// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(PORT , ()=>{console.log(`server started at port ${PORT}`)});
