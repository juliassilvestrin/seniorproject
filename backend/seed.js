// seed script - populates the database with real tutor/schedule data
// run with: npm run seed
// WARNING: this clears all existing data before inserting

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')
const Course = require('./models/Course')
const Schedule = require('./models/Schedule')
const Absence = require('./models/Absence')
const InviteCode = require('./models/InviteCode')

dotenv.config()

const DEFAULT_PASSWORD = 'tutoring123'

const tutors = [
  {
    name: 'Julia Silvestrin',
    email: 'd00479588@utahtech.edu',
    password: 'julia1',
    role: 'Admin',
    bio: 'Developer and administrator of the tutoring center system.',
    tagline: 'System Developer & Admin',
    specialization: 'Administration',
    aboutParagraphs: ['Developer and admin.'],
    courses: [],
    stats: [],
    isActive: true
  },
  {
    name: 'Jarod',
    email: 'jarod@utahtech.edu',
    password: DEFAULT_PASSWORD,
    role: 'Admin',
    bio: 'CS senior with 2+ years of tutoring experience. Strong background in programming fundamentals, databases, and IT systems.',
    tagline: 'Computer Science Senior • 2 Years Tutoring',
    specialization: 'Programming & Databases',
    aboutParagraphs: [
      'I\'m a senior Computer Science student who enjoys helping others build confidence in coding. Whether you\'re stuck on a bug or trying to understand a concept, I\'m here to help.',
      'I cover a wide range of CS and IT courses, from intro programming all the way to databases and systems.'
    ],
    courses: ['CS 1400', 'CS 1410', 'CS 2420', 'CS 3005', 'CS 3520', 'CS 4500', 'IT 2300', 'IT 2500', 'IT 3100', 'SE 1400', 'SE 3150'],
    stats: [
      { value: '2+', label: 'Years Tutoring' },
      { value: '150+', label: 'Students Helped' },
      { value: '4.9', label: 'Avg Rating' },
      { value: '11', label: 'Courses' }
    ],
    isActive: true
  },
  {
    name: 'Austin',
    email: 'austin@utahtech.edu',
    password: DEFAULT_PASSWORD,
    role: 'Senior Tutor',
    bio: 'CS junior with broad knowledge across CS, IT, and SE. Known for being patient and great at breaking down hard concepts.',
    tagline: 'Computer Science Junior • 2 Years Tutoring',
    specialization: 'Broad CS & IT',
    aboutParagraphs: [
      'I\'m a junior studying Computer Science. I\'ve always enjoyed helping classmates figure things out, and tutoring lets me do that officially.',
      'I can help with most CS and IT courses. My goal is to make sure you leave each session feeling more confident than when you came in.'
    ],
    courses: ['CS 1400', 'CS 1410', 'CS 2100', 'CS 2420', 'CS 2450', 'CS 2810', 'CS 3005', 'CS 3150', 'CS 3520', 'IT 1100', 'IT 1200', 'IT 2300', 'IT 2400', 'SE 1400', 'SE 3020'],
    stats: [
      { value: '2+', label: 'Years Tutoring' },
      { value: '180+', label: 'Students Helped' },
      { value: '4.8', label: 'Avg Rating' },
      { value: '15', label: 'Courses' }
    ],
    isActive: true
  },
  {
    name: 'Drew',
    email: 'drew@utahtech.edu',
    password: DEFAULT_PASSWORD,
    role: 'Tutor',
    bio: 'Software engineering student who loves algorithms and systems. Great at walking through code step by step.',
    tagline: 'Software Engineering Junior • 1 Year Tutoring',
    specialization: 'Algorithms & Software Engineering',
    aboutParagraphs: [
      'I\'m studying Software Engineering with a focus on algorithms and good software practices. I enjoy the puzzle-solving side of programming.',
      'I tutoring data structures, C++, SE courses, and more. Come find me if you\'re struggling with assignments or just want a second pair of eyes on your code.'
    ],
    courses: ['CS 2420', 'CS 2450', 'CS 3005', 'CS 3150', 'CS 3410', 'CS 3500', 'CS 3530', 'IT 2400', 'IT 2500', 'IT 2700', 'IT 3300', 'SE 3150', 'SE 3200'],
    stats: [
      { value: '1+', label: 'Years Tutoring' },
      { value: '80+', label: 'Students Helped' },
      { value: '4.7', label: 'Avg Rating' },
      { value: '13', label: 'Courses' }
    ],
    isActive: true
  },
  {
    name: 'Theisen',
    email: 'theisen@utahtech.edu',
    password: DEFAULT_PASSWORD,
    role: 'Tutor',
    bio: 'IT and CS tutor focused on intro courses. Approachable and good at explaining concepts from scratch.',
    tagline: 'IT Student • 1 Year Tutoring',
    specialization: 'Intro Courses & IT',
    aboutParagraphs: [
      'I\'m an IT student who started tutoring to help students who were in the same position I was — confused and needing someone to explain things clearly.',
      'I focus on intro-level CS and IT courses. No question is too basic — I\'m happy to start from the beginning.'
    ],
    courses: ['CS 1400', 'CS 2100', 'CS 3410', 'IT 1100', 'IT 1200', 'IT 4200', 'SE 1400'],
    stats: [
      { value: '1+', label: 'Years Tutoring' },
      { value: '60+', label: 'Students Helped' },
      { value: '4.8', label: 'Avg Rating' },
      { value: '7', label: 'Courses' }
    ],
    isActive: true
  }
]

// courses from the TA experience chart
const courses = [
  // CS
  { code: 'CS 1400', name: 'Fundamentals of Programming', description: 'Introduction to programming using Python. Covers variables, control structures, functions, and basic data structures.' },
  { code: 'CS 1410', name: 'Object-Oriented Programming', description: 'Object-oriented design and programming. Covers classes, inheritance, polymorphism, and interfaces.' },
  { code: 'CS 2100', name: 'Discrete Mathematics', description: 'Mathematical foundations for computing including logic, sets, functions, combinatorics, and graph theory.' },
  { code: 'CS 2420', name: 'Data Structures & Algorithms', description: 'Fundamental data structures and algorithms including lists, trees, graphs, sorting, and searching.' },
  { code: 'CS 2450', name: 'Software Engineering', description: 'Introduction to software engineering principles, Agile methodology, version control, and team development practices.' },
  { code: 'CS 2810', name: 'Computer Architecture', description: 'Computer organization, assembly language, digital logic, memory hierarchy, and processor design.' },
  { code: 'CS 3005', name: 'Programming in C++', description: 'Advanced programming in C++ including memory management, templates, STL, and systems-level programming.' },
  { code: 'CS 3150', name: 'Software Development', description: 'Advanced software development practices including design patterns, testing, and collaborative development.' },
  { code: 'CS 3410', name: 'Advanced Algorithms', description: 'Algorithm design and analysis including dynamic programming, greedy algorithms, and complexity theory.' },
  { code: 'CS 3500', name: 'Operating Systems', description: 'Concepts of modern operating systems including processes, memory management, file systems, and concurrency.' },
  { code: 'CS 3520', name: 'Database Systems', description: 'Relational database design, SQL, normalization, indexing, transactions, and NoSQL databases.' },
  { code: 'CS 3530', name: 'Computer Networks', description: 'Network architecture, protocols, TCP/IP, routing, and network security fundamentals.' },
  { code: 'CS 4320', name: 'Machine Learning', description: 'Introduction to machine learning algorithms, supervised and unsupervised learning, and practical applications.' },
  { code: 'CS 4500', name: 'Senior Project', description: 'Capstone project applying computer science skills to a real-world software development problem.' },
  // IT
  { code: 'IT 1100', name: 'Introduction to IT', description: 'Foundations of information technology including hardware, software, networking, and cybersecurity basics.' },
  { code: 'IT 1200', name: 'IT Support Fundamentals', description: 'Practical IT support skills including troubleshooting, hardware, operating systems, and help desk practices.' },
  { code: 'IT 2300', name: 'Networking Fundamentals', description: 'Network concepts, topologies, protocols, IP addressing, and basic network configuration.' },
  { code: 'IT 2400', name: 'Systems Administration', description: 'Managing Linux and Windows server environments, user administration, scripting, and automation.' },
  { code: 'IT 2500', name: 'Cybersecurity Fundamentals', description: 'Core concepts of information security, threat analysis, encryption, and security best practices.' },
  { code: 'IT 2700', name: 'Cloud Computing', description: 'Introduction to cloud platforms, services, virtualization, and deployment models.' },
  { code: 'IT 3100', name: 'Network Security', description: 'Advanced network security, firewalls, intrusion detection, VPNs, and security auditing.' },
  { code: 'IT 3300', name: 'Database Administration', description: 'Database administration tasks including installation, configuration, backup, and performance tuning.' },
  { code: 'IT 4200', name: 'IT Project Management', description: 'Managing IT projects using industry frameworks, risk management, and stakeholder communication.' },
  // SE
  { code: 'SE 1400', name: 'Intro to Software Engineering', description: 'Foundational concepts of software engineering, the software development lifecycle, and professional practices.' },
  { code: 'SE 3020', name: 'Software Design', description: 'Software architecture, design patterns, UML modeling, and principles of good software design.' },
  { code: 'SE 3150', name: 'Software Testing', description: 'Testing methodologies, unit testing, integration testing, test-driven development, and QA practices.' },
  { code: 'SE 3200', name: 'Requirements Engineering', description: 'Techniques for eliciting, analyzing, documenting, and managing software requirements.' }
]

// real schedule from the ta availability chart
// each row is 1 hour - consolidated into contiguous slots per person per day
// dayOfWeek: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
const scheduleData = [
  // jarod: mon/wed 10am-12pm, fri 10am-12pm + 3pm-7pm
  { tutorName: 'Jarod', dayOfWeek: 0, startTime: '10:00', endTime: '12:00', location: 'Smith Computer Center' },
  { tutorName: 'Jarod', dayOfWeek: 2, startTime: '10:00', endTime: '12:00', location: 'Smith Computer Center' },
  { tutorName: 'Jarod', dayOfWeek: 4, startTime: '10:00', endTime: '12:00', location: 'Smith Computer Center' },
  { tutorName: 'Jarod', dayOfWeek: 4, startTime: '15:00', endTime: '19:00', location: 'Smith Computer Center' },

  // austin: mon/wed 12pm-7pm, tue/thu 10am-11am
  { tutorName: 'Austin', dayOfWeek: 0, startTime: '12:00', endTime: '19:00', location: 'Smith Computer Center' },
  { tutorName: 'Austin', dayOfWeek: 1, startTime: '10:00', endTime: '11:00', location: 'Smith Computer Center' },
  { tutorName: 'Austin', dayOfWeek: 2, startTime: '12:00', endTime: '19:00', location: 'Smith Computer Center' },
  { tutorName: 'Austin', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', location: 'Smith Computer Center' },

  // drew: tue/thu 11am-3pm, fri 12pm-3pm
  { tutorName: 'Drew', dayOfWeek: 1, startTime: '11:00', endTime: '15:00', location: 'Smith Computer Center' },
  { tutorName: 'Drew', dayOfWeek: 3, startTime: '11:00', endTime: '15:00', location: 'Smith Computer Center' },
  { tutorName: 'Drew', dayOfWeek: 4, startTime: '12:00', endTime: '15:00', location: 'Smith Computer Center' },

  // theisen: tue/thu 3pm-7pm
  { tutorName: 'Theisen', dayOfWeek: 1, startTime: '15:00', endTime: '19:00', location: 'Smith Computer Center' },
  { tutorName: 'Theisen', dayOfWeek: 3, startTime: '15:00', endTime: '19:00', location: 'Smith Computer Center' }
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to mongodb')

    // clear everything
    await User.deleteMany({})
    await Course.deleteMany({})
    await Schedule.deleteMany({})
    await Absence.deleteMany({})
    await InviteCode.deleteMany({})
    console.log('cleared all collections')

    // create users
    const createdUsers = []
    for (const tutorData of tutors) {
      const user = await User.create(tutorData)
      createdUsers.push(user)
      console.log(`  created user: ${user.name} (${user.role})`)
    }

    // create courses
    await Course.insertMany(courses)
    console.log(`  created ${courses.length} courses`)

    // create schedule slots - map tutor names to user ids
    const userMap = {}
    for (const user of createdUsers) {
      userMap[user.name] = user
    }

    for (const slot of scheduleData) {
      const user = userMap[slot.tutorName]
      if (user) {
        await Schedule.create({
          user: user._id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          location: slot.location,
          courses: user.courses
        })
      }
    }
    console.log(`  created ${scheduleData.length} schedule slots`)

    // create invite codes
    const adminUser = createdUsers.find(u => u.role === 'Admin')
    await InviteCode.create([
      {
        code: 'UTU-2026-ALPHA',
        role: 'Tutor',
        createdBy: adminUser._id,
        expiresAt: new Date('2026-05-15'),
        status: 'active'
      },
      {
        code: 'UTU-2026-BETA',
        role: 'Senior Tutor',
        createdBy: adminUser._id,
        expiresAt: new Date('2026-05-15'),
        status: 'active'
      }
    ])
    console.log('  created 2 invite codes')

    console.log('\nseed complete!')
    console.log(`  ${createdUsers.length} users (2 admins + 3 tutors)`)
    console.log(`  ${courses.length} courses`)
    console.log(`  ${scheduleData.length} schedule slots`)
    console.log(`  2 invite codes`)
    console.log(`\nlogin credentials:`)
    console.log(`  d00479588@utahtech.edu / julia  →  Admin`)
    console.log(`  jarod@utahtech.edu / ${DEFAULT_PASSWORD}   →  Admin`)
    console.log(`  austin@utahtech.edu / ${DEFAULT_PASSWORD}  →  Senior Tutor`)
    console.log(`  drew@utahtech.edu / ${DEFAULT_PASSWORD}    →  Tutor`)
    console.log(`  theisen@utahtech.edu / ${DEFAULT_PASSWORD} →  Tutor`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('seed error:', err)
    process.exit(1)
  }
}

seed()
