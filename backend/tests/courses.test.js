// courses route tests - public endpoint that returns courses with tutor availability

require('./setup')

const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Course = require('../models/Course')
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

const createCourse = (overrides = {}) =>
  Course.create({
    code: 'CS 1400',
    name: 'Intro to Programming',
    description: 'Learn to code',
    ...overrides
  })

describe('GET /api/courses', () => {
  test('returns all courses', async () => {
    await createCourse()
    await createCourse({ code: 'CS 1410', name: 'OOP' })

    const res = await request(app).get('/api/courses')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0]).toHaveProperty('code')
    expect(res.body[0]).toHaveProperty('name')
    expect(res.body[0]).toHaveProperty('tutors')
  })

  test('returns empty array when no courses exist', async () => {
    const res = await request(app).get('/api/courses')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('each course includes its tutors', async () => {
    await createCourse()
    await createTutor({ courses: ['CS 1400'] })

    const res = await request(app).get('/api/courses')

    expect(res.body[0].tutors).toHaveLength(1)
    expect(res.body[0].tutors[0].name).toBe('Alice Tutor')
  })

  test('does not include inactive tutors in course tutor list', async () => {
    await createCourse()
    await createTutor({ courses: ['CS 1400'] })
    await createTutor({
      name: 'Inactive Bob',
      email: 'bob@utahtech.edu',
      courses: ['CS 1400'],
      isActive: false
    })

    const res = await request(app).get('/api/courses')

    expect(res.body[0].tutors).toHaveLength(1)
    expect(res.body[0].tutors[0].name).toBe('Alice Tutor')
  })

  test('tutor shows available: true when currently in a slot', async () => {
    await createCourse()
    const tutor = await createTutor({ courses: ['CS 1400'] })

    // create a slot that covers all hours of all days so tutor is always "on"
    for (let day = 0; day < 5; day++) {
      await Schedule.create({
        user: tutor._id,
        dayOfWeek: day,
        startTime: '00:00',
        endTime: '23:59',
        location: 'Smith Building',
        courses: []
      })
    }

    const res = await request(app).get('/api/courses')

    expect(res.body[0].tutors[0].available).toBe(true)
  })

  test('course with no matching tutors returns empty tutors array', async () => {
    await createCourse({ code: 'CS 9999', name: 'Obscure Course' })
    await createTutor({ courses: ['CS 1400'] }) // tutor doesn't cover CS 9999

    const res = await request(app).get('/api/courses')

    const obscure = res.body.find(c => c.code === 'CS 9999')
    expect(obscure.tutors).toEqual([])
  })

  test('courses are sorted by code', async () => {
    await createCourse({ code: 'SE 3500', name: 'Software Engineering' })
    await createCourse({ code: 'CS 1400', name: 'Intro to Programming' })
    await createCourse({ code: 'IT 1100', name: 'Intro to IT' })

    const res = await request(app).get('/api/courses')

    const codes = res.body.map(c => c.code)
    expect(codes).toEqual([...codes].sort())
  })
})
