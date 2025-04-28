run node server/scripts/seeMockData.js to fill the dummy data

create tables using these sql commands

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  city VARCHAR(100),
  phone VARCHAR(20),
  section VARCHAR(50),
  category VARCHAR(50),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE for_sale_details (
  listing_id INT PRIMARY KEY,
  year_built INT,
  make_model VARCHAR(100),
  color VARCHAR(50),
  type VARCHAR(50),
  status VARCHAR(50),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE housing_details (
  listing_id INT PRIMARY KEY,
  bedrooms INT,
  sqft INT,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE jobs_details (
  listing_id INT PRIMARY KEY,
  job_type VARCHAR(100),
  salary DECIMAL(10,2),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE services_details (
  listing_id INT PRIMARY KEY,
  service_type VARCHAR(100),
  availability VARCHAR(100),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE community_details (
  listing_id INT PRIMARY KEY,
  event_name VARCHAR(100),
  event_date DATE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
