// Import necessary libraries for testing
const request = require('supertest'); // To test HTTP functions
const admin = require('firebase-admin'); // Firebase Admin SDK

// Import your Cloud Functions
const { likeArticle } = require('./index');

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
  const firestore = {
    collection: jest.fn().mockReturnThis(), // Allow chaining
    add: jest.fn().mockResolvedValue({ id: 'fakeDocumentId' }), // Mock successful add operation
  };

  return {
    initializeApp: jest.fn(), // Mock Firebase initialization
    firestore: jest.fn(() => firestore),
    apps: [{}], // Simulate that Firebase has been initialized
  };
});

// Test for Cloud Function (HTTP Trigger)
describe('likeArticle', () => {
  it('should return 400 if userId or articleId is missing', async () => {
    const response = await request(likeArticle).post('/likeArticle').send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe('Missing userId or articleId');
  }, 10000); // Increase timeout to 10000 ms

  it('should return 200 on successful log', async () => {
    const response = await request(likeArticle).post('/likeArticle').send({
      userId: 'user123',
      articleId: 'article123',
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Article liked successfully');
  }, 10000); // Increase timeout to 10000 ms

  it('should return 500 if there is a server error', async () => {
    // Mock Firestore 'add' method to throw an error for this specific test
    jest.spyOn(admin.firestore().collection('article_likes'), 'add').mockImplementationOnce(() => {
      throw new Error('Firestore error');
    });

    const response = await request(likeArticle).post('/likeArticle').send({
      userId: 'user123',
      articleId: 'article123',
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  }, 10000); // Increase timeout to 10000 ms
});

