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
    { name: 'ios devices', description: 'iPhones - Unlocked' },
    { name: 'android devices', description: 'Android Phones - Unlocked' },
  ];
  return Promise.all(categories.map((categorydetails) => categoryCreate(categorydetails)));
}

function createItems() {
  const items = [
    { 
      name: 'Apple iPhone 11 - Black', 
      description: 'Apple iPhone 11 64GB - Black - Unlocked',
      price: 979.99,
      number_in_stock: 5, 
      category: [categories[0]],
    },
    { 
      name: 'Apple iPhone 11 - Green', 
      description: 'Apple iPhone 11 64GB - Green - Unlocked',
      price: 979.99,
      number_in_stock: 5, 
    },
    { 
      name: 'Apple iPhone 11 Pro Max 64GB - Green', 
      description: 'Apple iPhone 11 Pro Max 64GB - Midnight Green - Unlocked',
      price: 1519.99,
      number_in_stock: 5, 
      category: [categories[0]],
    },
    { 
      name: 'Samsung Galaxy Note20 Ultra 5G - Black', 
      description: 'Samsung Galaxy Note20 Ultra 5G 128GB - Mystic Black - Unlocked',
      price: 1819.99,
      number_in_stock: 5, 
      category: [categories[1]],
    },
    { 
      name: 'Samsung Galaxy Note20 Ultra 5G - Bronze', 
      description: 'Samsung Galaxy Note20 Ultra 5G 128GB - Mystic Bronze - Unlocked',
      price: 1819.99,
      number_in_stock: 5, 
      category: [categories[1]],
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