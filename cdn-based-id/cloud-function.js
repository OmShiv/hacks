/**
 * Google Cloud function (can also be done in Akamai Edge)
 */

const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const axios = require('axios'); // Use axios to make HTTP requests to ipinfo.io
const storage = new Storage();

// Define the bucket and file location (adjust this based on where your file is stored)
const bucketName = 'lms-analytics';
const fileName = 'websdk-temp.js';

// Utility function to get client details (now uses ipinfo.io for city and timezone)
async function getClientDetails(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.ip || req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Use ipinfo.io to get city, country, and timezone from IP
    const ipInfoUrl = `https://ipinfo.io/${ip}/json?token=119db1a48185de`;

    let city = 'Unknown';
    let country = 'Unknown';
    let timezone = 'Unknown';

    try {
        const response = await axios.get(ipInfoUrl);
        if (response.data) {
            city = response.data.city || 'Unknown';
            country = response.data.country || 'Unknown';
            timezone = response.data.timezone || 'Unknown';
        }
    } catch (error) {
        console.error('Error fetching IP geolocation data:', error);
    }

    return { ip, city, country, userAgent, timezone };
}

// Main function to generate and serve content
exports.fillSdkValues = async (req, res) => {
    try {
        const { ip, city, country, userAgent, timezone } = await getClientDetails(req);

        // Download the original file content from Google Cloud Storage
        const file = storage.bucket(bucketName).file(fileName);
        const [contentBuffer] = await file.download();
        let content = contentBuffer.toString();

        // Generate 2 unique identities
        const [identity1, identity2] = await generateIDs(ip, userAgent);

        // Replace placeholders with actual client details and identifiers
        content = content
            .replace('[[VALUE_1]]', ip)
            .replace('[[VALUE_2]]', city)
            .replace('[[VALUE_3]]', country)
            .replace('[[VALUE_4]]', userAgent)
            .replace('[[VALUE_5]]', timezone)
            .replace('[[LINKEDIN_TAG_ID_1]]', identity1)  
            .replace('[[LINKEDIN_TAG_ID_2]]', identity2);

        // Set the appropriate response headers and send the modified content to the client
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 'max-age=31536000, public'); // Cache for 1 year
        res.send(content);

    } catch (error) {
        console.error(`Error fetching or processing file: ${error}`);
        res.status(500).send('Error processing request.');
    }
};

// Utility function to hash strings using SHA-256
async function hashString(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

// Function to generate 2 unique identities based on the client's data
async function generateIDs(ip, userAgent) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Identity 1: Hash of the client's IP address
    const identity1 = await hashString(ip);

    // Identity 2: Hash of IP + User Agent (separately hashed, then concatenated)
    const identity2 = await hashString(ip + userAgent + today);

    return [identity1, identity2];
}
