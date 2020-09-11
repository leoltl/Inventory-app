#! /usr/bin/env node

require('dotenv').config();

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var Category = require('./models/category.model')
var Item = require('./models/item.model')


var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

async function categoryCreate(categorydetails) {
  var category = new Category({ ...categorydetails });
       
  await category.save()
  console.log(`New Category: ${category}`);
  categories.push(category)
}

async function itemCreate(itemdetails) {
  var item = new Item({ ...itemdetails });
  await item.save();
  console.log(`New Item: ${item}`);
  items.push(item)
}

function createCategories() {
  const categories = [
    { 
      name: 'ios devices',
      description: 'iPhones - Unlocked',
      icon_url: 'https://merchandising-assets.bestbuy.ca/bltc8653f66842bff7f/bltb972321aaf8c188a/5d1d5846106d2f5640263e36/bbym-evergreen-icon-iphonexsmax.jpg?width=400&quality=80'
    },
    { name: 'android devices',
      description: 'Android Phones - Unlocked',
      icon_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/147/14797/14797691.jpg'
    },
  ];
  return Promise.all(categories.map((categorydetails) => categoryCreate(categorydetails)));
}

function createItems() {
  const items = [
    { 
      name: 'Apple iPhone 11 64GB - Black - Unlocked', 
      description: 'Shoot 4K videos, beautiful portraits and sweeping landscapes with the all-new dual-camera system. Capture your best low-light photos with Night mode. See true-to-life colour in your photos, videos and games on the 6.1-inch Liquid Retina display. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR) and photography. Do more and charge less with all-day battery life. And worry less with water resistance up to 2 metres for 30 minutes.',
      price: 979.99,
      number_in_stock: 5, 
      category: [categories[0]],
      image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/138/13888/13888815.jpg'
    },
    { 
      name: 'Apple iPhone 11 64GB - Purple - Unlocked', 
      description: 'Shoot 4K videos, beautiful portraits and sweeping landscapes with the all-new dual-camera system. Capture your best low-light photos with Night mode. See true-to-life colour in your photos, videos and games on the 6.1-inch Liquid Retina display. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR) and photography. Do more and charge less with all-day battery life. And worry less with water resistance up to 2 metres for 30 minutes.',
      price: 979.99,
      number_in_stock: 5,
      category: [categories[0]],
      image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/138/13888/13888819.jpg'
    },
    { 
      name: 'Apple iPhone 11 Pro Max 64GB - Midnight Green - Unlocked', 
      description: 'Shoot amazing videos and photos with the Ultra Wide, Wide and Telephoto cameras. Capture your best low-light photos with Night mode. Watch HDR movies and shows on the 6.5-inch Super Retina XDR display—the brightest iPhone display yet. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR) and photography. And get all-day battery life and a new level of water resistance. All in the first iPhone powerful enough to be called Pro.',
      price: 1519.99,
      number_in_stock: 5,
      category: [categories[0]],
      image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/138/13888/13888854.jpg'
    },
    { 
      name: 'Samsung Galaxy Note20 Ultra 5G 512GB - Mystic Black - Unlocked', 
      description: 'Put a beautiful, intelligent, powerful phone in your palm with the Samsung Galaxy Note20 Ultra 5G. Its visually stunning 6.9" Infinity-O Display and Snapdragon 865+ processor deliver the performance you need for gaming, entertainment, productivity and much more. Shoot 8K video at 24fps and make your own pro-quality films. With the mighty S Pen, take notes or sketch your ideas as they come.',
      price: 1819.99,
      number_in_stock: 5, 
      category: [categories[1]],
      image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/147/14797/14797696.jpg'
    },
    { 
      name: 'Samsung Galaxy Note20 Ultra 5G 128GB - Mystic Bronze - Unlocked', 
      description: 'Put a beautiful, intelligent, powerful phone in your palm with the Samsung Galaxy Note20 Ultra 5G. Its visually stunning 6.9" Infinity-O Display and Snapdragon 865+ processor deliver the performance you need for gaming, entertainment, productivity and much more. Shoot 8K video at 24fps and make your own pro-quality films. With the mighty S Pen, take notes or sketch your ideas as they come.',
      price: 1819.99,
      number_in_stock: 5, 
      category: [categories[1]],
      image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/150x150/147/14797/14797694.jpg'
    },
  ];
  return Promise.all(items.map((categorydetails) => itemCreate(categorydetails)));
}

async function seedDB() {
  try {
    await createCategories();
    await createItems();
  } catch (e) {
    console.log('ERR: '+ e);
  } finally {
    console.log('Categories', categories);
    console.log('Items', items);
    mongoose.connection.close();
  }
};

(async function () {
  await seedDB();
}());