const Url = require('../models/Url');
const Visit = require('../models/Visit');
const generateShortCode = require('../utils/generateShortCode');
const validator = require('validator');

// @desc    Create short URL
// @route   POST /api/url
// @access  Private
exports.createUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl || !validator.isURL(originalUrl)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid URL' });
        }

        const shortCode = generateShortCode();
        
        const url = await Url.create({
            originalUrl,
            shortCode,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Success',
            data: url
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get user's URLs
// @route   GET /api/url
// @access  Private
exports.getUrls = async (req, res, next) => {
    try {
        const urls = await Url.findByUserId(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Success',
            data: urls
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete URL
// @route   DELETE /api/url/:id
// @access  Private
exports.deleteUrl = async (req, res, next) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ success: false, message: 'URL not found' });
        }

        // Make sure user owns URL
        if (url.user_id !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await Visit.deleteByUrlId(url.id);
        await Url.deleteById(url.id);

        res.status(200).json({
            success: true,
            message: 'Success',
            data: {}
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get URL analytics
// @route   GET /api/url/:id/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ success: false, message: 'URL not found' });
        }

        // Make sure user owns URL
        if (url.user_id !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const visits = await Visit.findByUrlId(url.id, 10);

        res.status(200).json({
            success: true,
            message: 'Success',
            data: {
                totalClicks: url.click_count,
                lastVisited: visits.length > 0 ? visits[0].timestamp : null,
                recentHistory: visits
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Redirect to original URL
// @route   GET /:shortCode
// @access  Public
exports.redirectToUrl = async (req, res, next) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });

        if (!url) {
            // Should probably redirect to a frontend 404 page or just show error
            return res.status(404).json({ success: false, message: 'URL not found' });
        }

        await Url.incrementClickCount(url.id);
        await Visit.create({ urlId: url.id });

        res.redirect(url.original_url);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
