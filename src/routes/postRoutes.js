const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

router.get('/posts/search', PostController.search); // Importante vir antes do :id
router.get('/posts', PostController.index);
router.get('/posts/:id', PostController.show);
router.post('/posts', PostController.store);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.delete);

module.exports = router;