import React, { useState, useEffect, useRef } from 'react';
   import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
   import axios from 'axios';
   import QRCode from 'qrcode.react';
   import jsQR from 'jsqr';
   import './App.css';

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<AdminPage />} />
           <Route path="/client" element={<ClientPage />} />
         </Routes>
       </Router>
     );
   }

   function AdminPage() {
     const [view, setView] = useState('login');
     const [signupData, setSignupData] = useState({
       firstName: '', lastName: '', phone: '', medicalId: '', username: '', password: '', retypePassword: ''
     });
     const [loginData, setLoginData] = useState({ username: '', password: '' });
     const [patientData, setPatientData] = useState({
       ticketId: '', name: '', diagnosis: '', date: '', details: '', file: null
     });
     const [patients, setPatients] = useState([]);
     const [error, setError] = useState('');

     useEffect(() => {
       if (view === 'admin') fetchPatients();
     }, [view]);

     const handleSignupChange = (e) => {
       setSignupData({ ...signupData, [e.target.name]: e.target.value });
     };

     const handleLoginChange = (e) => {
       setLoginData({ ...loginData, [e.target.name]: e.target.value });
     };

     const handlePatientChange = (e) => {
       setPatientData({ ...patientData, [e.target.name]: e.target.value });
     };

     const handleFileChange = (e) => {
       setPatientData({ ...patientData, file: e.target.files[0] });
     };

     const handleSignup = async (e) => {
       e.preventDefault();
       if (signupData.password !== signupData.retypePassword) {
         setError('Passwords do not match');
         return;
       }
       try {
         await axios.post('http://localhost:5001/api/signup', signupData);
         alert('User registered successfully');
         setView('login');
         setSignupData({ firstName: '', lastName: '', phone: '', medicalId: '', username: '', password: '', retypePassword: '' });
       } catch (err) {
         setError('Signup failed');
       }
     };

     const handleLogin = async (e) => {
       e.preventDefault();
       try {
         const response = await axios.post('http://localhost:5001/api/login', loginData);
         alert(`Welcome, ${response.data.user.firstName} ${response.data.user.lastName}`);
         setView('admin');
         setLoginData({ username: '', password: '' });
       } catch (err) {
         setError('Invalid credentials');
       }
     };

     const handlePatientSubmit = async (e) => {
       e.preventDefault();
       const formData = new FormData();
       for (const key in patientData) {
         if (key !== 'file') formData.append(key, patientData[key]);
       }
       if (patientData.file) formData.append('file', patientData.file);
       try {
         const response = await axios.post('http://localhost:5001/api/patient', formData, {
           headers: { 'Content-Type': 'multipart/form-data' }
         });
         alert('Record added successfully');
         setPatientData({ ticketId: '', name: '', diagnosis: '', date: '', details: '', file: null });
         fetchPatients();
       } catch (err) {
         setError('Failed to add record');
       }
     };

     const fetchPatients = async () => {
       try {
         const response = await axios.get('http://localhost:5001/api/patients');
         setPatients(response.data);
       } catch (err) {
         setError('Failed to fetch patients');
       }
     };

     const renderLogin = () => (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
         <div className="p-8 bg-white rounded shadow-md w-96">
           <h2 className="text-2xl font-bold mb-4 text-blue-600">Admin Login</h2>
           <form onSubmit={handleLogin} className="space-y-4">
             <input type="text" name="username" value={loginData.username} onChange={handleLoginChange} placeholder="Username" className="w-full p-2 border rounded" required />
             <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Password" className="w-full p-2 border rounded" required />
             <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
           </form>
           <button onClick={() => setView('signup')} className="mt-4 text-blue-600 hover:underline">Sign up</button>
           <br />
           <Link to="/client" className="mt-4 text-blue-600 hover:underline">Go to Patient Portal</Link>
           {error && <p className="text-red-600">{error}</p>}
         </div>
       </div>
     );

     const renderSignup = () => (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
         <div className="p-8 bg-white rounded shadow-md w-96">
           <h2 className="text-2xl font-bold mb-4 text-blue-600">Admin Sign Up</h2>
           <form onSubmit={handleSignup} className="space-y-4">
             <input type="text" name="firstName" value={signupData.firstName} onChange={handleSignupChange} placeholder="First Name" className="w-full p-2 border rounded" required />
             <input type="text" name="lastName" value={signupData.lastName} onChange={handleSignupChange} placeholder="Last Name" className="w-full p-2 border rounded" required />
             <input type="text" name="phone" value={signupData.phone} onChange={handleSignupChange} placeholder="Phone" className="w-full p-2 border rounded" required />
             <input type="text" name="medicalId" value={signupData.medicalId} onChange={handleSignupChange} placeholder="Medical ID" className="w-full p-2 border rounded" required />
             <input type="text" name="username" value={signupData.username} onChange={handleSignupChange} placeholder="Username" className="w-full p-2 border rounded" required />
             <input type="password" name="password" value={signupData.password} onChange={handleSignupChange} placeholder="Password" className="w-full p-2 border rounded" required />
             <input type="password" name="retypePassword" value={signupData.retypePassword} onChange={handleSignupChange} placeholder="Retype Password" className="w-full p-2 border rounded" required />
             <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</button>
           </form>
           <button onClick={() => setView('login')} className="mt-4 text-blue-600 hover:underline">Back to Login</button>
           {error && <p className="text-red-600">{error}</p>}
         </div>
       </div>
     );

     const renderAdmin = () => (
       <div className="min-h-screen bg-gray-100 p-8">
         <h2 className="text-2xl font-bold mb-4 text-blue-600">Admin Panel</h2>
         <button onClick={() => setView('login')} className="mb-4 p-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
         <Link to="/client" className="mb-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block ml-4">Go to Patient Portal</Link>
         <h3 className="text-xl font-bold mb-2">Add Patient Record</h3>
         <form onSubmit={handlePatientSubmit} className="space-y-4 mb-8">
           <input type="text" name="ticketId" value={patientData.ticketId} onChange={handlePatientChange} placeholder="Ticket ID" className="w-full p-2 border rounded" required />
           <input type="text" name="name" value={patientData.name} onChange={handlePatientChange} placeholder="Name" className="w-full p-2 border rounded" required />
           <input type="text" name="diagnosis" value={patientData.diagnosis} onChange={handlePatientChange} placeholder="Diagnosis" className="w-full p-2 border rounded" required />
           <input type="date" name="date" value={patientData.date} onChange={handlePatientChange} className="w-full p-2 border rounded" required />
           <input type="text" name="details" value={patientData.details} onChange={handlePatientChange} placeholder="Details" className="w-full p-2 border rounded" required />
           <input type="file" name="file" onChange={handleFileChange} accept=".pdf,.png" className="w-full p-2 border rounded" />
           <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Record</button>
         </form>
         <h3 className="text-xl font-bold mb-2">Patient Records</h3>
         <table className="w-full border-collapse">
           <thead>
             <tr className="bg-blue-600 text-white">
               <th className="p-2">Ticket ID</th>
               <th className="p-2">Name</th>
               <th className="p-2">Diagnosis</th>
               <th className="p-2">Date</th>
               <th className="p-2">Details</th>
               <th className="p-2">File</th>
               <th className="p-2">QR Code</th>
             </tr>
           </thead>
           <tbody>
             {patients.map(patient => (
               <tr key={patient.ticketId} className="border-b">
                 <td className="p-2">{patient.ticketId}</td>
                 <td className="p-2">{patient.name}</td>
                 <td className="p-2">{patient.diagnosis}</td>
                 <td className="p-2">{patient.date}</td>
                 <td className="p-2">{patient.details}</td>
                 <td className="p-2">{patient.filePath ? <a href={`http://localhost:5001/${patient.filePath}`} className="text-blue-600 hover:underline">Download</a> : 'N/A'}</td>
                 <td className="p-2"><QRCode value={JSON.stringify({ ticketId: patient.ticketId, key: patient.key })} size={100} /></td>
               </tr>
             ))}
           </tbody>
         </table>
         {error && <p className="text-red-600">{error}</p>}
       </div>
     );

     return (
       <div>
         {view === 'login' && renderLogin()}
         {view === 'signup' && renderSignup()}
         {view === 'admin' && renderAdmin()}
       </div>
     );
   }

   function ClientPage() {
     const [clientData, setClientData] = useState({ ticketId: '', key: '' });
     const [clientResult, setClientResult] = useState(null);
     const [error, setError] = useState('');
     const [attempts, setAttempts] = useState(0);
     const videoRef = useRef(null);
     const canvasRef = useRef(null);
     const [scanning, setScanning] = useState(false);

     const handleClientChange = (e) => {
       setClientData({ ...clientData, [e.target.name]: e.target.value });
     };

     const handleClientSubmit = async (e) => {
       e.preventDefault();
       if (attempts >= 3) {
         setError('Too many incorrect attempts. Please contact hospital patient record management.');
         return;
       }
       try {
         const response = await axios.get(`http://localhost:5001/api/patient/${clientData.ticketId}`, {
           params: { key: clientData.key }
         });
         setClientResult(response.data);
         setAttempts(0);
         setError('');
       } catch (err) {
         setAttempts(attempts + 1);
         setError('Record not found or invalid key');
       }
     };

     const startScanning = async () => {
       setScanning(true);
       try {
         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
         videoRef.current.srcObject = stream;
         videoRef.current.play();
         scanQRCode();
       } catch (err) {
         setError('Failed to access camera');
         setScanning(false);
       }
     };

     const stopScanning = () => {
       if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
         setScanning(false);
       }
     };

     const scanQRCode = () => {
       if (!scanning) return;
       const canvas = canvasRef.current;
       const video = videoRef.current;
       const context = canvas.getContext('2d');
       context.drawImage(video, 0, 0, canvas.width, canvas.height);
       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
       const code = jsQR(imageData.data, imageData.width, imageData.height);
       if (code) {
         try {
           const qrData = JSON.parse(code.data);
           setClientData({ ticketId: qrData.ticketId, key: qrData.key });
           stopScanning();
         } catch (err) {
           setError('Invalid QR code');
         }
       }
       requestAnimationFrame(scanQRCode);
     };

     return (
       <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
         <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
           <h2 className="text-2xl font-bold mb-4 text-blue-600">Patient Portal</h2>
           <Link to="/" className="mb-4 text-blue-600 hover:underline">Back to Admin Login</Link>
           <h3 className="text-lg font-bold mb-2">Scan QR Code or Enter Details</h3>
           <div className="mb-4">
             {!scanning ? (
               <button onClick={startScanning} className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Start QR Scan</button>
             ) : (
               <button onClick={stopScanning} className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700">Stop QR Scan</button>
             )}
             <video ref={videoRef} className="w-full mt-4 hidden" />
             <canvas ref={canvasRef} className="hidden" width="640" height="480" />
           </div>
           <form onSubmit={handleClientSubmit} className="space-y-4">
             <input type="text" name="ticketId" value={clientData.ticketId} onChange={handleClientChange} placeholder="Ticket ID" className="w-full p-2 border rounded" required />
             <input type="text" name="key" value={clientData.key} onChange={handleClientChange} placeholder="Access Key" className="w-full p-2 border rounded" required />
             <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Access Record</button>
           </form>
           {error && <p className="text-red-600 mt-4">{error}</p>}
           {clientResult && (
             <div className="mt-4 p-4 border rounded">
               <h3 className="font-bold">Patient Record</h3>
               <p><strong>Ticket ID:</strong> {clientResult.decryptedReport.ticketId}</p>
               <p><strong>Name:</strong> {clientResult.decryptedReport.name}</p>
               <p><strong>Diagnosis:</strong> {clientResult.decryptedReport.diagnosis}</p>
               <p><strong>Date:</strong> {clientResult.decryptedReport.date}</p>
               <p><strong>Details:</strong> {clientResult.decryptedReport.details}</p>
               {clientResult.filePath && <a href={`http://localhost:5001/${clientResult.filePath}`} className="text-blue-600 hover:underline">Download File</a>}
             </div>
           )}
         </div>
       </div>
     );
   }

   export default App;