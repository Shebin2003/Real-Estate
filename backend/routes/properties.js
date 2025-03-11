const express = require('express');
const router = express.Router();

const { properties } = require('../controllers')

router.post('/sell',properties.addProperty)                        // Adding property for sale
router.get('/search',properties.searchProperty)                    // Searching for plots
router.post('/filter',properties.filterAndSort)                    // Filter and Sorting
router.post('/saved',properties.savedTableInsert)                  // Inserting into saved table
router.get('/saved',properties.savedTableretrieve)                 // Retrieving from saved table
router.get('/myproperties',properties.retrieveProperties)          // Retrieving my properties
router.post('/myproperties',properties.deleteProperty)             // Deleting a property
router.post('/deleteSaved',properties.deleteSaved)                 // Delete saved property

module.exports = router