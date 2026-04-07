// global test setup - uses a local mongodb test database so tests don't touch production data

const mongoose = require('mongoose')

const TEST_DB_URI = 'mongodb://localhost:27017/tutoring-test'

// set a stable JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret-key'

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI)
})

afterAll(async () => {
  // drop the whole test database when done
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})

// wipe all collections between tests to keep them isolated
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})
