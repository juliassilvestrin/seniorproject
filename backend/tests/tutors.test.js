// tutor route tests - public profile endpoints + protected schedule/absence crud

require('./setup')

const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Schedule = require('../models/Schedule')
const Absence = require('../models/Absence')

// helpers
const createTutor = (overrides = {}) =>
  User.create({
    name: 'Alice Tutor',
    email: 'alice@utahtech.edu',
    password: 'password123',
    role: 'Tutor',
    courses: ['CS 1400', 'CS 1410'],
    bio: 'I love helping students.',
    ...overrides
  })

const loginAs = async (email, password = 'password123') => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
  return res.body.token
}


// PUBLIC ROUTES


describe('GET /api/tutors', () => {
  test('returns list of active tutors', async () => {
    await createTutor()
    await createTutor({ name: 'Bob Tutor', email: 'bob@utahtech.edu' })

    const res = await request(app).get('/api/tutors')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0]).toHaveProperty('name')
    expect(res.body[0]).toHaveProperty('slug')
    expect(res.body[0]).toHaveProperty('available')
    expect(res.body[0].password).toBeUndefined()
  })

  test('does not return inactive tutors', async () => {
    await createTutor()
    await createTutor({ name: 'Inactive Bob', email: 'inactive@utahtech.edu', isActive: false })

    const res = await request(app).get('/api/tutors')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe('Alice Tutor')
  })
})

describe('GET /api/tutors/:slug', () => {
  test('returns full tutor profile', async () => {
    await createTutor()

    const res = await request(app).get('/api/tutors/alice-tutor')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Alice Tutor')
    expect(res.body.courses).toContain('CS 1400')
    expect(res.body.schedule).toBeDefined()
  })

  test('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/tutors/does-not-exist')
    expect(res.status).toBe(404)
  })

  test('returns 404 for inactive tutor', async () => {
    await createTutor({ isActive: false })
    const res = await request(app).get('/api/tutors/alice-tutor')
    expect(res.status).toBe(404)
  })
})


// PROTECTED ROUTES


describe('PUT /api/tutors/me/profile', () => {
  test('updates bio and courses', async () => {
    await createTutor()
    const token = await loginAs('alice@utahtech.edu')

    const res = await request(app)
      .put('/api/tutors/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Updated bio', courses: ['CS 1400'] })

    expect(res.status).toBe(200)
    expect(res.body.bio).toBe('Updated bio')
    expect(res.body.courses).toEqual(['CS 1400'])
  })

  test('returns 401 without token', async () => {
    const res = await request(app)
      .put('/api/tutors/me/profile')
      .send({ bio: 'test' })

    expect(res.status).toBe(401)
  })
})

describe('Schedule CRUD', () => {
  let token

  beforeEach(async () => {
    await createTutor()
    token = await loginAs('alice@utahtech.edu')
  })

  test('GET /api/tutors/me/schedule returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('POST /api/tutors/me/schedule adds a slot', async () => {
    const res = await request(app)
      .post('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ dayOfWeek: 0, startTime: '09:00', endTime: '12:00', location: 'Smith Building' })

    expect(res.status).toBe(201)
    expect(res.body.dayOfWeek).toBe(0)
    expect(res.body.time).toBe('9:00 AM - 12:00 PM')
    expect(res.body.id).toBeDefined()
  })

  test('PUT /api/tutors/me/schedule/:id edits a slot', async () => {
    const addRes = await request(app)
      .post('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ dayOfWeek: 0, startTime: '09:00', endTime: '12:00', location: 'Smith Building' })

    const slotId = addRes.body.id

    const editRes = await request(app)
      .put(`/api/tutors/me/schedule/${slotId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ startTime: '10:00', endTime: '13:00' })

    expect(editRes.status).toBe(200)
    expect(editRes.body.time).toBe('10:00 AM - 1:00 PM')
  })

  test('DELETE /api/tutors/me/schedule/:id removes a slot', async () => {
    const addRes = await request(app)
      .post('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ dayOfWeek: 1, startTime: '14:00', endTime: '17:00', location: 'Smith Building' })

    const slotId = addRes.body.id

    const delRes = await request(app)
      .delete(`/api/tutors/me/schedule/${slotId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(delRes.status).toBe(200)

    // confirm it's gone
    const listRes = await request(app)
      .get('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes.body).toHaveLength(0)
  })

  test('cannot delete another tutor\'s slot', async () => {
    // create a second tutor and add a slot as them
    await createTutor({ name: 'Bob Tutor', email: 'bob@utahtech.edu' })
    const bobToken = await loginAs('bob@utahtech.edu')

    const addRes = await request(app)
      .post('/api/tutors/me/schedule')
      .set('Authorization', `Bearer ${bobToken}`)
      .send({ dayOfWeek: 2, startTime: '09:00', endTime: '11:00', location: 'Smith Building' })

    const slotId = addRes.body.id

    // alice tries to delete bob's slot
    const delRes = await request(app)
      .delete(`/api/tutors/me/schedule/${slotId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(delRes.status).toBe(403)
  })
})

describe('Absence CRUD', () => {
  let token

  beforeEach(async () => {
    await createTutor()
    token = await loginAs('alice@utahtech.edu')
  })

  test('GET /api/tutors/me/absences returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/tutors/me/absences')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('POST /api/tutors/me/absences adds an absence', async () => {
    const res = await request(app)
      .post('/api/tutors/me/absences')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-04-10', reason: 'sick day' })

    expect(res.status).toBe(201)
    expect(res.body.reason).toBe('sick day')
    expect(res.body.id).toBeDefined()
  })

  test('DELETE /api/tutors/me/absences/:id removes an absence', async () => {
    const addRes = await request(app)
      .post('/api/tutors/me/absences')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-04-11', reason: 'conference' })

    const absenceId = addRes.body.id

    const delRes = await request(app)
      .delete(`/api/tutors/me/absences/${absenceId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(delRes.status).toBe(200)

    const listRes = await request(app)
      .get('/api/tutors/me/absences')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes.body).toHaveLength(0)
  })

  test('cannot delete another tutor\'s absence', async () => {
    await createTutor({ name: 'Bob Tutor', email: 'bob@utahtech.edu' })
    const bobToken = await loginAs('bob@utahtech.edu')

    const addRes = await request(app)
      .post('/api/tutors/me/absences')
      .set('Authorization', `Bearer ${bobToken}`)
      .send({ date: '2026-04-12' })

    const absenceId = addRes.body.id

    const delRes = await request(app)
      .delete(`/api/tutors/me/absences/${absenceId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(delRes.status).toBe(403)
  })
})
