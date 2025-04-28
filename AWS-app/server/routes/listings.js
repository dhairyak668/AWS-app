import express from 'express'
import db from '../db.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()

// GET all listings (optionally filter by section/category)
router.get('/', async (req, res) => {
  const { section, category } = req.query

  let baseQuery = 'SELECT listings.*'
  let joinQuery = ''
  const params = []
  if (section === 'for-sale') {
    baseQuery += ', for_sale_details.year_built, for_sale_details.make_model, for_sale_details.color, for_sale_details.type, for_sale_details.status'
    joinQuery = ' LEFT JOIN for_sale_details ON listings.id = for_sale_details.listing_id'
  } else if (section === 'housing') {
    baseQuery += ', housing_details.bedrooms, housing_details.sqft'
    joinQuery = ' LEFT JOIN housing_details ON listings.id = housing_details.listing_id'
  } else if (section === 'services') {
    baseQuery += ', services_details.service_type, services_details.availability'
    joinQuery = ' LEFT JOIN services_details ON listings.id = services_details.listing_id'
  } else if (section === 'jobs') {
    baseQuery += ', jobs_details.job_type, jobs_details.salary'
    joinQuery = ' LEFT JOIN jobs_details ON listings.id = jobs_details.listing_id'
  } else if (section === 'community') {
    baseQuery += ', community_details.event_name, community_details.event_date'
    joinQuery = ' LEFT JOIN community_details ON listings.id = community_details.listing_id'
  } else {
    // If no section or unknown section, join all detail tables to include all possible detail fields
    baseQuery += ', for_sale_details.year_built, for_sale_details.make_model, for_sale_details.color, for_sale_details.type, for_sale_details.status'
    baseQuery += ', housing_details.bedrooms, housing_details.sqft'
    baseQuery += ', services_details.service_type, services_details.availability'
    baseQuery += ', jobs_details.job_type, jobs_details.salary'
    baseQuery += ', community_details.event_name, community_details.event_date'

    joinQuery = `
      LEFT JOIN for_sale_details ON listings.id = for_sale_details.listing_id
      LEFT JOIN housing_details ON listings.id = housing_details.listing_id
      LEFT JOIN services_details ON listings.id = services_details.listing_id
      LEFT JOIN jobs_details ON listings.id = jobs_details.listing_id
      LEFT JOIN community_details ON listings.id = community_details.listing_id
    `
  }

  let whereClauses = []
  if (section) {
    whereClauses.push('listings.section = ?')
    params.push(section)
  }
  if (category) {
    whereClauses.push('listings.category = ?')
    params.push(category)
  }

  let whereQuery = ''
  if (whereClauses.length > 0) {
    whereQuery = ' WHERE ' + whereClauses.join(' AND ')
  }

  const query = `${baseQuery} FROM listings${joinQuery}${whereQuery}`

  try {
    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch listings' })
  }
})

// POST a new listing
router.post('/', authenticate, async (req, res) => {
  const { title, description, price, city, phone, section, category } = req.body
  const user_id = req.user.id

  if (!title || !description || !price || !city || !phone || !section || !category) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const [result] = await db.query(
      'INSERT INTO listings (title, description, price, city, phone, section, category, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, city, phone, section, category, user_id]
    )
    const listingId = result.insertId

    // Insert into section-specific detail table
    if (section === 'for-sale') {
      const { year_built, make_model, color, type, status } = req.body
      await db.query(
        'INSERT INTO for_sale_details (listing_id, year_built, make_model, color, type, status) VALUES (?, ?, ?, ?, ?, ?)',
        [listingId, year_built || null, make_model || null, color || null, type || null, status || null]
      )
    } else if (section === 'housing') {
      const { bedrooms, sqft } = req.body
      await db.query(
        'INSERT INTO housing_details (listing_id, bedrooms, sqft) VALUES (?, ?, ?)',
        [listingId, bedrooms || null, sqft || null]
      )
    } else if (section === 'services') {
      const { service_type, availability } = req.body
      await db.query(
        'INSERT INTO services_details (listing_id, service_type, availability) VALUES (?, ?, ?)',
        [listingId, service_type || null, availability || null]
      )
    } else if (section === 'jobs') {
      const { job_type, salary } = req.body
      await db.query(
        'INSERT INTO jobs_details (listing_id, job_type, salary) VALUES (?, ?, ?)',
        [listingId, job_type || null, salary || null]
      )
    } else if (section === 'community') {
      const { event_name, event_date } = req.body
      await db.query(
        'INSERT INTO community_details (listing_id, event_name, event_date) VALUES (?, ?, ?)',
        [listingId, event_name || null, event_date || null]
      )
    }

    res.status(201).json({ message: 'Listing created' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create listing' })
  }
})

// GET listings created by the logged-in user
router.get('/mine', authenticate, async (req, res) => {
  const user_id = req.user.id

  const baseQuery = `SELECT listings.*, 
    for_sale_details.year_built, for_sale_details.make_model, for_sale_details.color, for_sale_details.type, for_sale_details.status,
    housing_details.bedrooms, housing_details.sqft,
    services_details.service_type, services_details.availability,
    jobs_details.job_type, jobs_details.salary,
    community_details.event_name, community_details.event_date
  `
  const joinQuery = `
    LEFT JOIN for_sale_details ON listings.id = for_sale_details.listing_id
    LEFT JOIN housing_details ON listings.id = housing_details.listing_id
    LEFT JOIN services_details ON listings.id = services_details.listing_id
    LEFT JOIN jobs_details ON listings.id = jobs_details.listing_id
    LEFT JOIN community_details ON listings.id = community_details.listing_id
  `
  const whereQuery = ' WHERE listings.user_id = ?'
  const query = `${baseQuery} FROM listings${joinQuery}${whereQuery}`

  try {
    const [rows] = await db.query(query, [user_id])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch your listings' })
  }
})

// PUT update a listing by id (only if it belongs to the logged-in user)
router.put('/:id', authenticate, async (req, res) => {
  const listingId = req.params.id
  const user_id = req.user.id
  const { title, description, price, city, phone, section, category } = req.body

  if (!title || !description || !price || !city || !phone || !section || !category) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Check if listing belongs to user
    const [existing] = await db.query('SELECT * FROM listings WHERE id = ? AND user_id = ?', [listingId, user_id])
    if (existing.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this listing' })
    }

    await db.query(
      'UPDATE listings SET title = ?, description = ?, price = ?, city = ?, phone = ?, section = ?, category = ? WHERE id = ?',
      [title, description, price, city, phone, section, category, listingId]
    )

    // Upsert section-specific detail table (check existence, then update or insert)
    if (section === 'for-sale') {
      const { year_built, make_model, color, type, status } = req.body
      const [detailRows] = await db.query('SELECT 1 FROM for_sale_details WHERE listing_id = ?', [listingId])
      if (detailRows.length === 0) {
        await db.query(
          'INSERT INTO for_sale_details (listing_id, year_built, make_model, color, type, status) VALUES (?, ?, ?, ?, ?, ?)',
          [listingId, year_built || null, make_model || null, color || null, type || null, status || null]
        )
      } else {
        await db.query(
          'UPDATE for_sale_details SET year_built = ?, make_model = ?, color = ?, type = ?, status = ? WHERE listing_id = ?',
          [year_built || null, make_model || null, color || null, type || null, status || null, listingId]
        )
      }
    } else if (section === 'housing') {
      const { bedrooms, sqft } = req.body
      const [detailRows] = await db.query('SELECT 1 FROM housing_details WHERE listing_id = ?', [listingId])
      if (detailRows.length === 0) {
        await db.query(
          'INSERT INTO housing_details (listing_id, bedrooms, sqft) VALUES (?, ?, ?)',
          [listingId, bedrooms || null, sqft || null]
        )
      } else {
        await db.query(
          'UPDATE housing_details SET bedrooms = ?, sqft = ? WHERE listing_id = ?',
          [bedrooms || null, sqft || null, listingId]
        )
      }
    } else if (section === 'services') {
      const { service_type, availability } = req.body
      const [detailRows] = await db.query('SELECT 1 FROM services_details WHERE listing_id = ?', [listingId])
      if (detailRows.length === 0) {
        await db.query(
          'INSERT INTO services_details (listing_id, service_type, availability) VALUES (?, ?, ?)',
          [listingId, service_type || null, availability || null]
        )
      } else {
        await db.query(
          'UPDATE services_details SET service_type = ?, availability = ? WHERE listing_id = ?',
          [service_type || null, availability || null, listingId]
        )
      }
    } else if (section === 'jobs') {
      const { job_type, salary } = req.body
      const [detailRows] = await db.query('SELECT 1 FROM jobs_details WHERE listing_id = ?', [listingId])
      if (detailRows.length === 0) {
        await db.query(
          'INSERT INTO jobs_details (listing_id, job_type, salary) VALUES (?, ?, ?)',
          [listingId, job_type || null, salary || null]
        )
      } else {
        await db.query(
          'UPDATE jobs_details SET job_type = ?, salary = ? WHERE listing_id = ?',
          [job_type || null, salary || null, listingId]
        )
      }
    } else if (section === 'community') {
      const { event_name, event_date } = req.body
      const [detailRows] = await db.query('SELECT 1 FROM community_details WHERE listing_id = ?', [listingId])
      if (detailRows.length === 0) {
        await db.query(
          'INSERT INTO community_details (listing_id, event_name, event_date) VALUES (?, ?, ?)',
          [listingId, event_name || null, event_date || null]
        )
      } else {
        await db.query(
          'UPDATE community_details SET event_name = ?, event_date = ? WHERE listing_id = ?',
          [event_name || null, event_date || null, listingId]
        )
      }
    }

    res.json({ message: 'Listing updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update listing' })
  }
})

// DELETE a listing by id (only if it belongs to the logged-in user)
router.delete('/:id', authenticate, async (req, res) => {
  const listingId = req.params.id
  const user_id = req.user.id

  try {
    // Check if listing belongs to user
    const [existing] = await db.query('SELECT * FROM listings WHERE id = ? AND user_id = ?', [listingId, user_id])
    if (existing.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' })
    }

    await db.query('DELETE FROM listings WHERE id = ?', [listingId])

    res.json({ message: 'Listing deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete listing' })
  }
})

export default router