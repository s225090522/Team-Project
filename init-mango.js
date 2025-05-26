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

print('✅ Database and collections initialized!');
