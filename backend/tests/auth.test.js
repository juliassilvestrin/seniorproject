// auth route tests - login, register, /me

require('./setup') // connects in-memory mongodb + registers beforeAll/afterAll/afterEach

const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const InviteCode = require('../models/InviteCode')

// helper - create a tutor user directly in db (bypasses invite flow)
const createUser = async (overrides = {}) => {
  return User.create({
    name: 'Test Tutor',
    email: 'test@utahtech.edu',
    password: 'password123',
    role: 'Tutor',
    ...overrides
  })
}

// helper - create an active invite code
const createInviteCode = async (role = 'Tutor') => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  return InviteCode.create({
    code: 'UTU-ABCDE',
    role,
    expiresAt: expires,
    status: 'active'
  })
}

describe('POST /api/auth/login', () => {
  test('returns token on valid credentials', async () => {
    await createUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@utahtech.edu', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('test@utahtech.edu')
  })

  test('returns 401 on wrong password', async () => {
    await createUser()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@utahtech.edu', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.token).toBeUndefined()
  })

  test('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@utahtech.edu', password: 'password123' })

    expect(res.status).toBe(401)
  })

  test('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@utahtech.edu' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/register', () => {
  test('creates user and returns token with valid invite code', async () => {
    await createInviteCode('Tutor')

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        inviteCode: 'UTU-ABCDE',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@utahtech.edu',
        password: 'password123'
      })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.name).toBe('Jane Smith')
    expect(res.body.user.role).toBe('Tutor')
  })

  test('assigns correct role from invite code', async () => {
    await createInviteCode('Senior Tutor')

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        inviteCode: 'UTU-ABCDE',
        firstName: 'Senior',
        lastName: 'Person',
        email: 'senior@utahtech.edu',
        password: 'password123'
      })

    expect(res.status).toBe(201)
    expect(res.body.user.role).toBe('Senior Tutor')
  })

  test('returns 400 for invalid invite code', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        inviteCode: 'UTU-XXXXX',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@utahtech.edu',
        password: 'password123'
      })

    expect(res.status).toBe(400)
  })

  test('returns 400 if email is already registered', async () => {
    await createUser({ email: 'taken@utahtech.edu' })
    await createInviteCode()

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        inviteCode: 'UTU-ABCDE',
        firstName: 'Another',
        lastName: 'Person',
        email: 'taken@utahtech.edu',
        password: 'password123'
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/already registered/i)
  })

  test('marks invite code as used after registration', async () => {
    await createInviteCode()

    await request(app)
      .post('/api/auth/register')
      .send({
        inviteCode: 'UTU-ABCDE',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@utahtech.edu',
        password: 'password123'
      })

    const code = await InviteCode.findOne({ code: 'UTU-ABCDE' })
    expect(code.status).toBe('used')
  })
})

describe('POST /api/auth/verify-code', () => {
  test('returns valid: true for an active code', async () => {
    await createInviteCode('Senior Tutor')

    const res = await request(app)
      .post('/api/auth/verify-code')
      .send({ code: 'UTU-ABCDE' })

    expect(res.status).toBe(200)
    expect(res.body.valid).toBe(true)
    expect(res.body.role).toBe('Senior Tutor')
  })

  test('returns 400 for an unknown code', async () => {
    const res = await request(app)
      .post('/api/auth/verify-code')
      .send({ code: 'UTU-ZZZZZ' })

    expect(res.status).toBe(400)
  })
})

describe('GET /api/health', () => {
  test('returns status ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('GET /api/auth/me', () => {
  test('returns current user info with valid token', async () => {
    const user = await createUser()

    // log in to get a token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@utahtech.edu', password: 'password123' })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@utahtech.edu')
    expect(res.body.password).toBeUndefined() // never expose password
  })

  test('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  test('returns 401 with a fake token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer faketoken')

    expect(res.status).toBe(401)
  })
})
