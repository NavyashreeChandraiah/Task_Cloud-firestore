Cloud Function & Firestore Trigger Challenge Deliverables

Code

    1. Cloud Function: likeArticle
    
        The likeArticle Cloud Function is designed to be triggered by an HTTP POST request. 
        It accepts userId and articleId in the request body, and adds a new document to the article_likes Firestore collection. 
        It returns a success message when the Firestore write operation completes successfully.
        Location: functions/index.js
  
    2. Firestore Trigger: logUserActivity
    
        The Firestore Trigger logUserActivity listens for new likes in the article_likes collection and logs them into the user_activity collection. 
        This helps with analytics and keeps a consistent record of user interactions.    
        Location: functions/index.js

Unit Tests

    index.test.js

    This test suite checks the functionality of the likeArticle Cloud Function. The Firebase Admin SDK is mocked to simulate interactions with Firestore.

    Location: functions/index.test.js

Instructions for Deployment and Testing

  Deployment
    
    1. Set Up Firebase:
    
        Install Firebase CLI:
        
            npm install -g firebase-tools
        
        Log in to Firebase:
        
            firebase login
        
        Initialize your project:
        
            firebase init functions
    
    2. Deploy Cloud Function and Firestore Trigger:
    
        Navigate to your functions directory:
        
            cd functions
        
        Deploy the functions:
        
            firebase deploy --only functions
          
            This command will deploy both likeArticle and logUserActivity functions
    
  Testing
      
    Test Scenarios:
    
        1. Missing Data: The function returns a 400 status code when either userId or articleId is missing.
    
        2. Successful Operation: The function correctly returns a 200 status code when the request is valid and the Firestore write operation succeeds.
    
        3. Server Error: Simulates a Firestore failure to ensure the function properly returns a 500 status code.
    
    1. Install Dependencies:
    
    In your functions directory, install necessary dependencies for testing:
    
        npm install supertest jest firebase-functions-test
    
    2. Run Tests:
    
        Run the tests using Jest:
        
            npx jest
    
        This will execute the unit tests for the likeArticle function, for scenarios like missing data, successful writes, and handling server errors.

    3. Testing with Postman:
        
        Endpoint: POST http://localhost:5001/{project-id}/us-central1/likeArticle
        
        Headers: Content-Type: application/json
        
        Body:
        
        {
          "userId": "user1",
          "articleId": "article1"
        }
        
        Expected Response:
        
        On success: 200 OK with message "Article liked successfully".
        
        On missing fields: 400 Bad Request with message "Missing userId or articleId".
        
        On server error: 500 Internal Server Error.

