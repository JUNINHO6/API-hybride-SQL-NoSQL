const express = require('express');
const router = express.Router();
const {
  getProfileByUserId,
  createProfile,
  updateProfile,
  addHistoryEntry
} = require('../controllers/profileController');

router.get('/:userId', getProfileByUserId);
router.post('/', createProfile);
router.put('/:userId', updateProfile);
router.post('/:userId/history', addHistoryEntry);

module.exports = router;
