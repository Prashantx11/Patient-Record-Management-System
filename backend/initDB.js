const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');
   const crypto = require('crypto');
   const CryptoJS = require('crypto-js');
   require('dotenv').config();

   mongoose.connect('mongodb://localhost:27017/hospitalDB', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
   .then(() => console.log('Connected to MongoDB for initialization'))
   .catch(err => console.error('MongoDB connection error:', err));

   const userSchema = new mongoose.Schema({
     firstName: String,
     lastName: String,
     phone: String,
     medicalId: String,
     username: String,
     password: String
   });
   const User = mongoose.model('User', userSchema);

   const patientSchema = new mongoose.Schema({
     ticketId: String,
     name: String,
     diagnosis: String,
     date: String,
     details: String,
     key: String,
     aesKey: String,
     filePath: String,
     encryptedReport: String
   });
   const Patient = mongoose.model('Patient', patientSchema);

   async function initDB() {
     try {
       await User.deleteMany({});
       await Patient.deleteMany({});
       console.log('Cleared existing users and patients');

       const admins = [
         {
           firstName: 'Admin',
           lastName: 'One',
           phone: '+1234567890',
           medicalId: 'ADM001',
           username: 'admin1',
           password: await bcrypt.hash('admin123', 10)
         },
         {
           firstName: 'Admin',
           lastName: 'Two',
           phone: '+1234567890',
           medicalId: 'ADM002',
           username: 'admin2',
           password: await bcrypt.hash('admin456', 10)
         }
       ];
       await User.insertMany(admins);
       console.log('Inserted 2 admin users');

       const patients = [
         {
           ticketId: '1000001',
           name: 'John Doe',
           diagnosis: 'Flu',
           date: '2025-07-01',
           details: 'Recovering well',
           key: crypto.randomBytes(16).toString('hex').slice(0, 16),
           aesKey: crypto.randomBytes(16).toString('hex')
         },
         {
           ticketId: '1000002',
           name: 'Jane Smith',
           diagnosis: 'Sprained Ankle',
           date: '2025-07-02',
           details: 'Needs rest',
           key: crypto.randomBytes(16).toString('hex').slice(0, 16),
           aesKey: crypto.randomBytes(16).toString('hex')
         },
         {
           ticketId: '1000003',
           name: 'Alice Johnson',
           diagnosis: 'Migraine',
           date: '2025-07-03',
           details: 'Prescribed medication',
           key: crypto.randomBytes(16).toString('hex').slice(0, 16),
           aesKey: crypto.randomBytes(16).toString('hex')
         },
         {
           ticketId: '1000004',
           name: 'Bob Wilson',
           diagnosis: 'Allergy',
           date: '2025-07-04',
           details: 'Avoid allergens',
           key: crypto.randomBytes(16).toString('hex').slice(0, 16),
           aesKey: crypto.randomBytes(16).toString('hex')
         },
         {
           ticketId: '1000005',
           name: 'Emma Brown',
           diagnosis: 'Fever',
           date: '2025-07-05',
           details: 'Monitor temperature',
           key: crypto.randomBytes(16).toString('hex').slice(0, 16),
           aesKey: crypto.randomBytes(16).toString('hex')
         }
       ];

       for (const patient of patients) {
         const reportData = {
           ticketId: patient.ticketId,
           name: patient.name,
           diagnosis: patient.diagnosis,
           date: patient.date,
           details: patient.details
         };
         patient.encryptedReport = CryptoJS.AES.encrypt(JSON.stringify(reportData), patient.aesKey).toString();
         await Patient.create(patient);
       }
       console.log('Inserted 5 patient records');

       console.log('Database initialization complete');
       mongoose.connection.close();
     } catch (err) {
       console.error('Error initializing database:', err);
       mongoose.connection.close();
     }
   }

   initDB();