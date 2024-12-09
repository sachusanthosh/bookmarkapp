const { Router } = require('express');
const Bookmark = require('../models/bookmark');


const router = Router();

router.get('/add-bm', (req, res) => {
    res.render('addBookMark', {
        user:req.user,
    });
})

router.post('/', async (req, res) => {

    const bookmarkCount = await Bookmark.countDocuments({},{userId: req.user._id});

    console.log("bookmarkCount :", bookmarkCount);
    console.log("userId :", req.user);


    if (bookmarkCount >= 5) {
        return res.render('addBookmark', {
            message: "You have reached the limit of 5 bookmarks. To add more, consider upgrading to the premium version.",
            user: req.user,
        });
    }
    

    const {title, url} = req.body
    try {
        await Bookmark.create({
            title,
            url,
            user: req.user._id,
        });

        return res.redirect('/'); // Redirect to the home page after successfully adding the bookmark
    } catch (error) {
        console.error(error);
        return res.render('addbookmark', {
            error: 'There was an error adding your bookmark.',
        });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.query || '';
    if (!query) {
      return res.json({ success: false, message: 'No query provided' });
    }
  
    try {
      // Search for bookmarks by title or URL using a case-insensitive regex search
      const bookmarks = await Bookmark.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { url: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.json({ success: true, bookmarks });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'Error occurred while searching for bookmarks' });
    }
  });
  
  // Edit Bookmark route - Display the edit form
router.get('/edit/:id', async (req, res) => {
    const bookmark = await Bookmark.findById(req.params.id);
    console.log("bookmark :", bookmark);
    
    if (!bookmark) {
      return res.redirect('/');
    }
    
    res.render('editBookmark', {
      bookmark: bookmark,
      user: req.user,
    });
  });
  
  // Update Bookmark route - Save the changes
  router.post('/edit/:id', async (req, res) => {
    const { title, url } = req.body;
    
    try {
      await Bookmark.findByIdAndUpdate(req.params.id, { title, url });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });

  // Delete Bookmark route
router.get('/delete/:id', async (req, res) => {
    try {
        // Find and delete the bookmark by ID
        const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
        
        if (!bookmark) {
            // If no bookmark found with the given ID, redirect back with an error
            return res.redirect('/?error=Bookmark+not+found');
        }

        // If the bookmark is successfully deleted, redirect to the homepage
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/?error=Error+deleting+bookmark');
    }
  });
  

module.exports = router;