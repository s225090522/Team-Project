db = db.getSiblingDB('homeglam');

if (!db.getCollectionNames().includes('users')) {
  db.createCollection('users');
  db.users.insertOne({
    name: 'admin',
    email: 'admin@gmail.com',
    password: 'password',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('✅ Users collection created and seeded.');
} else {
  print('✅ Users collection already exists. Skipping seeding.');
}

// Optional: Create a collection and add an initial document
if (!db.getCollectionNames().includes('services')) {
  db.createCollection('services');
  db.services.insertOne({
    name: 'Haircut',
    price: 30,
    duration: '30 mins'
  });
}

if( !db.getCollectionNames().includes('bookings')) {
  db.createCollection('bookings');
  db.bookings.insertOne({
    name: 'John Doe',
    service: 'Haircut',
    date: new Date(),
    time: '10:00 AM - 11:00 AM'
  });
  print('✅ Bookings collection created and seeded.');
}

if( !db.getCollectionNames().includes('enquire')) {
  db.createCollection('enquire');
  db.enquire.insertOne({
    name: 'Jane Doe',
    email: 'nobody@gmail.com',
    message: 'Hello, I would like to know more about your services.',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('✅ Enquire collection created and seeded.');
}

print('✅ Database and collections initialized!');
