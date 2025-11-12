import React, { useState } from 'react';
import { AuditResult } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { generateEmailBody } from '../services/geminiService';

interface AuditResultDisplayProps {
  result: AuditResult;
  businessName: string;
  onNewAudit: () => void;
}

const getScoreColor = (score: number): string => {
  if (score < 40) return '#ef4444'; // red-500
  if (score < 75) return '#f59e0b'; // amber-500
  return '#22c55e'; // green-500
};

const ScoreDonutChart: React.FC<{ score: number }> = ({ score }) => {
  const color = getScoreColor(score);
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  return (
    <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            <Cell fill={color} stroke={color} />
            <Cell fill="#e5e7eb" stroke="#e5e7eb" />
            <Label
              value={`${score}`}
              position="center"
              fill={color}
              className="text-5xl sm:text-6xl font-extrabold"
              dy={-10}
            />
            <Label
              value="out of 100"
              position="center"
              fill="#6b7280"
              className="text-sm sm:text-base"
              dy={20}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- ICONS ---
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.181-4.992-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.18 3.185" />
    </svg>
);
const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);
const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.94 0-1.62.68-1.62 1.93V19h-3v-9h3v1.38h.04c.41-.69 1.48-1.38 2.96-1.38 3.18 0 3.96 2.09 3.96 4.79z" />
    </svg>
);


const AuditResultDisplay: React.FC<AuditResultDisplayProps> = ({ result, businessName, onNewAudit }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShareEmail = async () => {
    setIsSharing(true);
    setShareError(null);
    try {
      const emailBody = await generateEmailBody(result, businessName);
      const subject = `Your Google Business Profile Audit for ${businessName}`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;
    } catch (error) {
      console.error("Failed to share email", error);
      setShareError("Could not generate email summary. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const text = encodeURIComponent(`I just audited my Google Business Profile for "${businessName}" and scored ${result.overallScore}/100! Get your free audit.`);
    const url = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        // Note: Facebook's sharer.php doesn't support the 'quote' parameter as reliably as it used to. The main mechanism is sharing the URL.
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(`Google Business Profile Audit Results for ${businessName}`)}&summary=${text}`;
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12">
      {/* Score Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Overall Score</h2>
        <ScoreDonutChart score={result.overallScore} />
        <p className="mt-4 text-gray-600 max-w-md mx-auto">This score reflects the overall health and optimization of your Google Business Profile based on key ranking factors.</p>
      </section>

      {/* Breakdown Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Audit Breakdown</h2>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
          <ul className="space-y-4">
            {result.auditBreakdown.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: getScoreColor(item.score) }}>
                  {item.score}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.category}</h3>
                  <p className="text-gray-600">{item.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Action Plan</h2>
        <div className="space-y-4">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border-l-4 border-indigo-500 shadow-sm">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
              </div>
              <p className="mt-2 text-gray-600 pl-9">{rec.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Export Section */}
      <section id="action-buttons" className="mt-12 text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Export, Share & Continue</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">Share this report with your team, save a copy for your records, or start a new audit.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
            onClick={handleShareEmail}
            disabled={isSharing}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
            {isSharing ? (
                <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                Generating...
                </>
            ) : (
                <>
                <ShareIcon className="w-5 h-5" />
                Share via Email
                </>
            )}
            </button>
            <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <DownloadIcon className="w-5 h-5" />
                Download as PDF
            </button>
             <button
                onClick={onNewAudit}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <RefreshIcon className="w-5 h-5" />
                Start New Audit
            </button>
        </div>
        {shareError && <p className="mt-4 text-sm text-red-600">{shareError}</p>}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center items-center gap-6">
            <p className="text-sm font-medium text-gray-600">Share on social media:</p>
            <div className="flex items-center gap-4">
                <button onClick={() => handleSocialShare('twitter')} aria-label="Share on Twitter" className="text-gray-500 hover:text-gray-900 transition-colors">
                    <TwitterIcon className="w-6 h-6" />
                </button>
                <button onClick={() => handleSocialShare('facebook')} aria-label="Share on Facebook" className="text-gray-500 hover:text-blue-600 transition-colors">
                    <FacebookIcon className="w-6 h-6" />
                </button>
                <button onClick={() => handleSocialShare('linkedin')} aria-label="Share on LinkedIn" className="text-gray-500 hover:text-blue-700 transition-colors">
                    <LinkedInIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AuditResultDisplay;
