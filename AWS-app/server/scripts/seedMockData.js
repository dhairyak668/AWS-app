import db from '../db.js'

// Mock users
const users = [
  { name: 'Alice Smith', email: 'alice@example.com', password: 'alice123' },
  { name: 'Bob Johnson', email: 'bob@example.com', password: 'bob123' },
  { name: 'Charlie Brown', email: 'charlie@example.com', password: 'charlie123' }
]

const runSeed = async () => {
  try {
    console.log('Seeding data...')

    // Insert users
    const userIds = []
    for (const user of users) {
      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [user.name, user.email, user.password]
      )
      userIds.push(result.insertId)
    }

    // For each user, insert listings and details
    for (const user_id of userIds) {
      // For Sale
      const [forSale] = await db.query(
        `INSERT INTO listings (title, description, price, city, phone, section, category, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Honda Civic', 'Used 2018 Honda Civic in great shape.', 9500.00, 'Ames', '555-1111', 'for-sale', 'cars', user_id]
      )
      await db.query(
        `INSERT INTO for_sale_details (listing_id, year_built, make_model, color, type, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [forSale.insertId, 2018, 'Honda Civic', 'Blue', 'Sedan', 'Good']
      )

      // Housing
      const [housing] = await db.query(
        `INSERT INTO listings (title, description, price, city, phone, section, category, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['2BR Apartment', 'Spacious apartment with balcony.', 1200.00, 'Iowa City', '555-2222', 'housing', 'apartments', user_id]
      )
      await db.query(
        `INSERT INTO housing_details (listing_id, bedrooms, sqft)
         VALUES (?, ?, ?)`,
        [housing.insertId, 2, 850]
      )

      // Jobs
      const [job] = await db.query(
        `INSERT INTO listings (title, description, price, city, phone, section, category, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Web Developer Internship', 'Paid summer internship for CS students.', 0.00, 'Des Moines', '555-3333', 'jobs', 'internships', user_id]
      )
      await db.query(
        `INSERT INTO jobs_details (listing_id, job_type, salary)
         VALUES (?, ?, ?)`,
        [job.insertId, 'Internship', 18.50]
      )

      // Services
      const [service] = await db.query(
        `INSERT INTO listings (title, description, price, city, phone, section, category, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Lawn Mowing', 'Weekly mowing services.', 40.00, 'Cedar Rapids', '555-4444', 'services', 'repair', user_id]
      )
      await db.query(
        `INSERT INTO services_details (listing_id, service_type, availability)
         VALUES (?, ?, ?)`,
        [service.insertId, 'Lawn Care', 'Weekends']
      )

      // Community
      const [event] = await db.query(
        `INSERT INTO listings (title, description, price, city, phone, section, category, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Charity Run', '5K event to raise money for schools.', 0.00, 'Dubuque', '555-5555', 'community', 'events', user_id]
      )
      await db.query(
        `INSERT INTO community_details (listing_id, event_name, event_date)
         VALUES (?, ?, ?)`,
        [event.insertId, 'Run for Education', '2025-09-15']
      )
    }

    console.log('Seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

runSeed()
