// schedule route tests - public weekly schedule endpoint

require('./setup')

const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Schedule = require('../models/Schedule')

const createTutor = (overrides = {}) =>
  User.create({
    name: 'Alice Tutor',
    email: 'alice@utahtech.edu',
    password: 'password123',
    role: 'Tutor',
    courses: ['CS 1400'],
    isActive: true,
    ...overrides
  })

describe('GET /api/schedule', () => {
  test('returns all schedule slots', async () => {
    const tutor = await createTutor()

    await Schedule.create({
      user: tutor._id,
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '12:00',
      location: 'Smith Building',
      courses: ['CS 1400']
    })

    const res = await request(app).get('/api/schedule')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].tutor).toBe('Alice Tutor')
    expect(res.body[0].time).toBe('9:00 AM - 12:00 PM')
    expect(res.body[0].dayIndex).toBe(0)
  })

  test('returns empty array when no slots exist', async () => {
    const res = await request(app).get('/api/schedule')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('excludes slots for inactive tutors', async () => {
    const activeTutor = await createTutor()
    const inactiveTutor = await createTutor({
      name: 'Inactive Bob',
      email: 'bob@utahtech.edu',
      isActive: false
    })

    await Schedule.create({
      user: activeTutor._id,
      dayOfWeek: 1,
      startTime: '10:00',
      endTime: '12:00',
      location: 'Smith Building',
      courses: []
    })

    await Schedule.create({
      user: inactiveTutor._id,
      dayOfWeek: 2,
      startTime: '10:00',
      endTime: '12:00',
      location: 'Smith Building',
      courses: []
    })

    const res = await request(app).get('/api/schedule')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].tutor).toBe('Alice Tutor')
  })

  test('slot uses tutor courses when slot courses is empty', async () => {
    const tutor = await createTutor({ courses: ['CS 1410', 'CS 2420'] })

    await Schedule.create({
      user: tutor._id,
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '11:00',
      location: 'Smith Building',
      courses: [] // empty - should fall back to tutor.courses
    })

    const res = await request(app).get('/api/schedule')

    expect(res.body[0].courses).toEqual(['CS 1410', 'CS 2420'])
  })
})
