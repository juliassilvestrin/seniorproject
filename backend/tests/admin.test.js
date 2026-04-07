// admin route tests - tutor management, courses, invite codes

require('./setup')

const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Course = require('../models/Course')
const InviteCode = require('../models/InviteCode')

// helpers
const createUser = (overrides = {}) =>
  User.create({
    name: 'Regular Tutor',
    email: 'tutor@utahtech.edu',
    password: 'password123',
    role: 'Tutor',
    ...overrides
  })

const createAdmin = () =>
  createUser({ name: 'Admin User', email: 'admin@utahtech.edu', role: 'Admin' })

const loginAs = async (email, password = 'password123') => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
  return res.body.token
}

// ACCESS CONTROL


describe('Admin route access control', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/tutors')
    expect(res.status).toBe(401)
  })

  test('returns 403 for non-admin user', async () => {
    await createUser()
    const token = await loginAs('tutor@utahtech.edu')

    const res = await request(app)
      .get('/api/admin/tutors')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
  })
})

// ==========================================
// TUTOR MANAGEMENT
// ==========================================

describe('GET /api/admin/tutors', () => {
  test('returns all tutors including inactive', async () => {
    await createAdmin()
    await createUser()
    await createUser({ name: 'Inactive One', email: 'inactive@utahtech.edu', isActive: false })

    const token = await loginAs('admin@utahtech.edu')

    const res = await request(app)
      .get('/api/admin/tutors')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3) // admin + active tutor + inactive tutor
  })
})

describe('PATCH /api/admin/tutors/:id/active', () => {
  test('toggles tutor active status', async () => {
    await createAdmin()
    const tutor = await createUser()
    const token = await loginAs('admin@utahtech.edu')

    const res = await request(app)
      .patch(`/api/admin/tutors/${tutor._id}/active`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.isActive).toBe(false) // was true, now false
  })

  test('returns 404 for unknown id', async () => {
    await createAdmin()
    const token = await loginAs('admin@utahtech.edu')

    const fakeId = '507f1f77bcf86cd799439011'
    const res = await request(app)
      .patch(`/api/admin/tutors/${fakeId}/active`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/admin/tutors/:id/role', () => {
  test('promotes a tutor to Senior Tutor', async () => {
    await createAdmin()
    const tutor = await createUser()
    const token = await loginAs('admin@utahtech.edu')

    const res = await request(app)
      .patch(`/api/admin/tutors/${tutor._id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'Senior Tutor' })

    expect(res.status).toBe(200)
    expect(res.body.role).toBe('Senior Tutor')
  })

  test('returns 400 for invalid role', async () => {
    await createAdmin()
    const tutor = await createUser()
    const token = await loginAs('admin@utahtech.edu')

    const res = await request(app)
      .patch(`/api/admin/tutors/${tutor._id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'Superuser' })

    expect(res.status).toBe(400)
  })
})

// ==========================================
// COURSE MANAGEMENT
// ==========================================

describe('Course management', () => {
  let token

  beforeEach(async () => {
    await createAdmin()
    token = await loginAs('admin@utahtech.edu')
  })

  test('GET /api/admin/courses returns courses list', async () => {
    await Course.create({ code: 'CS 1400', name: 'Intro to Programming', description: '' })

    const res = await request(app)
      .get('/api/admin/courses')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].code).toBe('CS 1400')
    expect(res.body[0].tutorCount).toBe(0)
  })

  test('POST /api/admin/courses creates a course', async () => {
    const res = await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'CS 2420', name: 'Data Structures', description: 'Arrays, trees, graphs' })

    expect(res.status).toBe(201)
    expect(res.body.code).toBe('CS 2420')
    expect(res.body.id).toBeDefined()
  })

  test('DELETE /api/admin/courses/:id removes a course', async () => {
    const course = await Course.create({ code: 'CS 1400', name: 'Intro to Programming', description: '' })

    const res = await request(app)
      .delete(`/api/admin/courses/${course._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)

    const found = await Course.findById(course._id)
    expect(found).toBeNull()
  })

  test('DELETE /api/admin/courses/:id returns 404 for unknown id', async () => {
    const fakeId = '507f1f77bcf86cd799439011'
    const res = await request(app)
      .delete(`/api/admin/courses/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})


// INVITE CODE MANAGEMENT

describe('Invite code management', () => {
  let token
  let adminUser

  beforeEach(async () => {
    adminUser = await createAdmin()
    token = await loginAs('admin@utahtech.edu')
  })

  test('GET /api/admin/invite-codes returns codes list', async () => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    await InviteCode.create({
      code: 'UTU-AAAAA',
      role: 'Tutor',
      createdBy: adminUser._id,
      expiresAt: expires
    })

    const res = await request(app)
      .get('/api/admin/invite-codes')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].code).toBe('UTU-AAAAA')
  })

  test('POST /api/admin/invite-codes generates a new code', async () => {
    const res = await request(app)
      .post('/api/admin/invite-codes')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'Tutor' })

    expect(res.status).toBe(201)
    expect(res.body.code).toMatch(/^UTU-/)
    expect(res.body.role).toBe('Tutor')
    expect(res.body.status).toBe('active')
  })

  test('DELETE /api/admin/invite-codes/:id revokes a code (soft delete)', async () => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    const code = await InviteCode.create({
      code: 'UTU-BBBBB',
      role: 'Tutor',
      createdBy: adminUser._id,
      expiresAt: expires
    })

    const res = await request(app)
      .delete(`/api/admin/invite-codes/${code._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)

    // code still exists but status is revoked
    const found = await InviteCode.findById(code._id)
    expect(found).not.toBeNull()
    expect(found.status).toBe('revoked')
  })
})
