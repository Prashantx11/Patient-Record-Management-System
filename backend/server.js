const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   const multer = require('multer');
   const path = require('path');
   const crypto = require('crypto');
   const QRCode = require('qrcode');
   const bcrypt = require('bcrypt');
   const CryptoJS = require('crypto-js');
   require('dotenv').config();

   const app = express();

   // Middleware
   app.use(cors());
   app.use(express.json());
   app.use('/uploads', express.static('uploads'));

   // MongoDB Connection
   mongoose.connect('mongodb://localhost:27017/hospitalDB', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('MongoDB connection error:', err));

   // Schemas
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

   // Multer for file uploads
   const storage = multer.diskStorage({
     destination: './uploads/',
     filename: (req, file, cb) => {
       cb(null, `${Date.now()}-${file.originalname}`);
     }
   });
   const upload = multer({
     storage,
     fileFilter: (req, file, cb) => {
       const filetypes = /pdf|png/;
       const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
       if (extname) {
         cb(null, true);
       } else {
         cb(new Error('Only PDF or PNG files allowed'));
       }
     }
   });

   // API Routes
   app.post('/api/signup', async (req, res) => {
     try {
       const { firstName, lastName, phone, medicalId, username, password } = req.body;
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = new User({
         firstName, lastName, phone, medicalId, username, password: hashedPassword
       });
       await user.save();
       res.json({ message: 'User registered' });
     } catch (err) {
       res.status(500).json({ error: 'Server error' });
     }
   });

   app.post('/api/login', async (req, res) => {
     try {
       const { username, password } = req.body;
       const user = await User.findOne({ username });
       if (!user) return res.status(401).json({ error: 'Invalid credentials' });
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
       res.json({ user: { firstName: user.firstName, lastName: user.lastName, phone: user.phone } });
     } catch (err) {
       res.status(500).json({ error: 'Server error' });
     }
   });

   app.post('/api/patient', upload.single('file'), async (req, res) => {
     try {
       const { ticketId, name, diagnosis, date, details } = req.body;
       const key = crypto.randomBytes(16).toString('hex').slice(0, 16);
       const aesKey = crypto.randomBytes(16).toString('hex'); // 32-character AES key
       if (!ticketId || !name || !diagnosis || !date || !details) {
         return res.status(400).json({ error: 'All fields are required' });
       }
       const reportData = { ticketId, name, diagnosis, date, details };
       const encryptedReport = CryptoJS.AES.encrypt(JSON.stringify(reportData), aesKey).toString();
       const patient = new Patient({
         ticketId, name, diagnosis, date, details, key, aesKey,
         filePath: req.file ? req.file.path : null,
         encryptedReport
       });
       await patient.save();
       const qrCode = await QRCode.toDataURL(JSON.stringify({ ticketId, key }));
       res.json({ message: 'Patient record added', ticketId, key, qrCode });
     } catch (err) {
       res.status(500).json({ error: 'Server error' });
     }
   });

   app.get('/api/patients', async (req, res) => {
     try {
       const patients = await Patient.find();
       res.json(patients);
     } catch (err) {
       res.status(500).json({ error: 'Server error' });
     }
   });

   app.get('/api/patient/:ticketId', async (req, res) => {
     try {
       const { ticketId } = req.params;
       const { key } = req.query;
       const patient = await Patient.findOne({ ticketId, key });
       if (!patient) return res.status(404).json({ error: 'Record not found or invalid key' });
       const decryptedReport = CryptoJS.AES.decrypt(patient.encryptedReport, patient.aesKey).toString(CryptoJS.enc.Utf8);
       res.json({ ...patient._doc, decryptedReport: JSON.parse(decryptedReport) });
     } catch (err) {
       res.status(500).json({ error: 'Server error' });
     }
   });

   const PORT = process.env.PORT || 5001;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));