const express = require('express');
const {
    createUrl,
    getUrls,
    deleteUrl,
    getAnalytics
} = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createUrl);
router.get('/', getUrls);
router.delete('/:id', deleteUrl);
router.get('/:id/analytics', getAnalytics);

module.exports = router;
