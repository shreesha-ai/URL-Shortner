const { customAlphabet } = require('nanoid');

const generateShortCode = () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 6);
    return nanoid();
};

module.exports = generateShortCode;
