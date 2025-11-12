import React, { useState, useEffect } from 'react';
import BusinessInputForm from './components/BusinessInputForm';
import AuditResultDisplay from './components/AuditResultDisplay';
import ServicesPromotion from './components/ServicesPromotion';
import Loader from './components/Loader';
import AdminArea from './components/AdminArea';
import { getGbpAudit } from './services/geminiService';
import { AuditResult } from './types';

const App: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Populate form from localStorage on initial load
    const storedEmail = localStorage.getItem('gbp-auditor-email');
    const storedBusinessName = localStorage.getItem('gbp-auditor-businessName');
    const storedLocation = localStorage.getItem('gbp-auditor-location');
    if (storedEmail) setEmail(storedEmail);
    if (storedBusinessName) setBusinessName(storedBusinessName);
    if (storedLocation) setLocation(storedLocation);
  }, []);

  useEffect(() => {
    // Persist form data to localStorage as user types
    if (!auditResult) { // Only save if we are not on the results page
        localStorage.setItem('gbp-auditor-email', email);
        localStorage.setItem('gbp-auditor-businessName', businessName);
        localStorage.setItem('gbp-auditor-location', location);
    }
  }, [email, businessName, location, auditResult]);

  const handleAudit = async () => {
    if (!businessName || !location || !email) {
      setError('Please fill out all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const result = await getGbpAudit(businessName, location);
      setAuditResult(result);
      
      // Save audit details to persistent history
      const newEntry = {
        email,
        businessName,
        location,
        timestamp: new Date().toISOString(),
      };
      const storedHistory = localStorage.getItem('gbp-audit-history');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      history.push(newEntry);
      localStorage.setItem('gbp-audit-history', JSON.stringify(history));

      // Clear storage for current form fields
      localStorage.removeItem('gbp-auditor-email');
      localStorage.removeItem('gbp-auditor-businessName');
      localStorage.removeItem('gbp-auditor-location');
    } catch (err) {
      console.error(err);
      setError('Failed to perform audit. The AI model may be busy. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewAudit = () => {
    setAuditResult(null);
    setBusinessName('');
    setLocation('');
    setEmail('');
    setError(null);
  };

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto page-container">
          <AdminArea onClose={() => setIsAdminView(false)} />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto page-container">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Google Business Profile Audit
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Get an instant analysis of your profile and discover how to rank higher.
          </p>
        </header>
        
        <main className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          {isLoading && <Loader />}
          
          {error && (
            <div className="my-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
              <p className="font-semibold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !auditResult && (
             <BusinessInputForm
              businessName={businessName}
              setBusinessName={setBusinessName}
              location={location}
              setLocation={setLocation}
              email={email}
              setEmail={setEmail}
              onAudit={handleAudit}
              isLoading={isLoading}
            />
          )}

          {!isLoading && auditResult && (
            <div className="animate-fade-in">
              <AuditResultDisplay result={auditResult} businessName={businessName} onNewAudit={handleNewAudit} />
            </div>
          )}
        </main>
        
        <div id="services-section" className="mt-12">
           <ServicesPromotion />
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SEO Services Inc. All rights reserved.</p>
          <p className="mt-1">
            Powered by Gemini AI
            <span className="mx-2" aria-hidden="true">|</span>
            <button 
              onClick={() => setIsAdminView(true)} 
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
            >
              Admin Panel
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
