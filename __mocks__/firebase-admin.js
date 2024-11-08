const firestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    add: jest.fn(() => Promise.resolve({})), // Mocking add to return a resolved promise
  })),
}));

const initializeApp = jest.fn();

const admin = {
  initializeApp,
  firestore,
  apps: [{}], // To simulate that an app has already been initialized
};

module.exports = admin;

