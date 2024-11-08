// Import necessary Firebase modules
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Reference Firestore
const db = admin.firestore();

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// HTTP Function to like an article
app.post("/likeArticle", async (req, res) => {
  const { userId, articleId } = req.body;

  if (!userId || !articleId) {
    logger.info("Request validation failed: Missing userId or articleId");
    return res.status(400).send("Missing userId or articleId");
  }

  try {
    logger.info(`Starting Firestore add operation for userId: ${userId}, articleId: ${articleId}`);
    const timestamp = Date.now();
    await db.collection("article_likes").add({
      userId,
      articleId,
      timestamp,
    });
    logger.info("Firestore add operation succeeded");
    res.status(200).send("Article liked successfully");
  } catch (error) {
    logger.error("Error liking article:", error.message, error.stack);
    res.status(500).send("Internal Server Error");
  }
});

// Export the Cloud Function
exports.likeArticle = onRequest(app);

// Firestore Trigger to log user activity when a like is created
exports.logUserActivity = onDocumentCreated(
  "article_likes/{likeId}",
  async (event) => {
    const likeData = event.data.data();
    const { userId, articleId } = likeData;

    if (!userId || !articleId) {
      logger.error("Invalid data in article_likes document");
      return;
    }

    try {
      const timestamp = Date.now();
      await db.collection("user_activity").add({
        userId,
        activityType: "article_liked",
        articleId,
        timestamp,
      });
      logger.info("User activity logged successfully");
    } catch (error) {
      logger.error("Error logging user activity:", error);
    }
  }
);

