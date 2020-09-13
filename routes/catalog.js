const express = require('express');
const router  = express.Router();

// Require controller modules.
var category_controller = require('../controllers/category.controller');
var item_controller     = require('../controllers/item.controller');

/* Index Routes */

router.get('/', category_controller.index);
router.get('/admin', category_controller.admin)

/* Category Routes */

// create
router.get ('/category/create'    , category_controller.create_get);
router.post('/category/create'    , category_controller.create_post);
// update
router.get ('/category/:id/edit'  , category_controller.update_get);
router.post('/category/:id/edit'  , category_controller.update_post);
// delete
router.post('/category/:id/delete', category_controller.delete_post);
// read
router.get ('/category/:id'       , category_controller.detail);
router.get ('/categories'         , category_controller.list);

/* Item Routes */

// create
router.get ('/item/create'    , item_controller.create_get);
router.post('/item/create'    , item_controller.create_post);
// update
router.get ('/item/:id/edit'  , item_controller.update_get);
router.post('/item/:id/edit'  , item_controller.update_post);
// delete
router.post('/item/:id/delete', item_controller.delete_post);
// read
router.get ('/item/:id'       , item_controller.detail);
router.get ('/items'          , item_controller.list);

module.exports = router;
