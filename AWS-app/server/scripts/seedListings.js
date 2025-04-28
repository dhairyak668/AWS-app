import db from '../db.js'

const data = {
  'for-sale': ['cars', 'motorcycles', 'boats', 'books', 'furniture'],
  'housing': ['apartments', 'rooms', 'houses', 'condos', 'sublets'],
  'services': ['repair', 'cleaning', 'moving', 'tutoring', 'event-planning'],
  'jobs': ['internships', 'full-time', 'part-time', 'remote', 'contract'],
  'community': ['events', 'classes', 'groups', 'lost+found', 'volunteers']
}

const cities = ['Ames', 'Des Moines', 'Cedar Rapids', 'Iowa City', 'Dubuque']
const types = ['Standard', 'Deluxe', 'Custom', 'Vintage', 'Basic']
const statuses = ['New', 'Like New', 'Good', 'Fair', 'Used']

const generateListing = (section, category, index) => ({
  title: `${category.charAt(0).toUpperCase() + category.slice(1)} Item ${index + 1}`,
  year_built: 2000 + Math.floor(Math.random() * 24),
  make_model: `Model-${Math.floor(Math.random() * 1000)}`,
  color: ['Red', 'Blue', 'Green', 'Black', 'White'][Math.floor(Math.random() * 5)],
  type: types[Math.floor(Math.random() * types.length)],
  status: statuses[Math.floor(Math.random() * statuses.length)],
  price: (Math.random() * 1000 + 100).toFixed(2),
  description: `This is a sample listing for ${category} in ${section}.`,
  city: cities[Math.floor(Math.random() * cities.length)],
  phone: `555-01${Math.floor(100 + Math.random() * 900)}`,
  section,
  category
})

const seedListings = async () => {
  try {
    console.log('Seeding listings...')
    for (const section of Object.keys(data)) {
      for (const category of data[section]) {
        for (let i = 0; i < 3; i++) {
          const item = generateListing(section, category, i)
          await db.query(
            `INSERT INTO listings 
            (title, year_built, make_model, color, type, status, price, description, city, phone, section, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              item.title, item.year_built, item.make_model, item.color,
              item.type, item.status, item.price, item.description,
              item.city, item.phone, item.section, item.category
            ]
          )
        }
      }
    }
    console.log('Seed complete!')
    process.exit(0)
  } catch (err) {
    console.error('Error seeding data:', err)
    process.exit(1)
  }
}

seedListings()