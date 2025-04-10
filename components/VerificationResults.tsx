import React from 'react';

type Finding = {
  type: 'positive' | 'negative' | 'neutral';
  description: string;
};

type SecurityIssue = {
  title: string;
  description: string;
};

type VerificationResultsProps = {
  results: {
    isAuthentic: boolean;
    confidence: number;
    findings: Finding[];
    securityIssues: SecurityIssue[];
    ocrData?: Record<string, string>;
    ocrMatchResults: Record<string, boolean>;
  };
};

const VerificationResults: React.FC<VerificationResultsProps> = ({ results }) => {
  const { isAuthentic, confidence, findings, securityIssues, ocrData, ocrMatchResults } = results;

  const getStatusColor = (): string => {
    return isAuthentic ? '#059669' : '#DC2626';
  };

  const getConfidenceClass = (score: number): 'high' | 'medium' | 'low' => {
    if (score > 80) return 'high';
    if (score > 50) return 'medium';
    return 'low';
  };

  return (
    <div className="verification-results">
      <div className="result-header" style={{ backgroundColor: getStatusColor() }}>
        <h2>{isAuthentic ? 'Document Verified ✓' : 'Verification Failed ✗'}</h2>
        <div className="confidence-meter">
          <span>Confidence:</span>
          <div className={`confidence-bar ${getConfidenceClass(confidence)}`}>
            <div className="confidence-fill" style={{ width: `${confidence}%` }}></div>
          </div>
          <span className="confidence-value">{confidence}%</span>
        </div>
      </div>

      <div className="result-details">
        <section className="findings-section">
          <h3>Analysis Findings</h3>
          <div className="findings-list">
            {findings.map((finding, index) => (
              <div key={index} className="finding-item">
                <div className="finding-icon">
                  {finding.type === 'positive' ? '✓' : finding.type === 'negative' ? '✗' : 'ℹ️'}
                </div>
                <div className="finding-content">
                  <p>{finding.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {securityIssues.length > 0 && (
          <section className="security-section">
            <h3>Security Concerns</h3>
            <div className="security-list">
              {securityIssues.map((issue, index) => (
                <div key={index} className="security-item">
                  <div className="security-icon">⚠️</div>
                  <div className="security-content">
                    <p className="security-title">{issue.title}</p>
                    <p className="security-description">{issue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {ocrData && (
          <section className="ocr-section">
            <h3>Extracted Information</h3>
            <div className="ocr-data">
              <table>
                <tbody>
                  {Object.entries(ocrData).map(([key, value]) => (
                    <tr key={key}>
                      <td className="field-name">{key.replace(/_/g, ' ').toUpperCase()}</td>
                      <td className="field-value">{value}</td>
                      <td className="field-match">
                        {ocrMatchResults[key] ? (
                          <span className="match-yes">✓</span>
                        ) : (
                          <span className="match-no">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .verification-results {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .result-header {
          padding: 1.5rem;
          color: white;
          text-align: center;
        }

        .result-header h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .confidence-meter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .confidence-bar {
          height: 12px;
          width: 60%;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background-color: white;
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        .confidence-value {
          font-weight: bold;
          min-width: 40px;
          text-align: right;
        }

        .result-details {
          padding: 1.5rem;
        }

        .findings-section,
        .security-section,
        .ocr-section {
          margin-bottom: 2rem;
        }

        h3 {
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1.25rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .findings-list,
        .security-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .finding-item,
        .security-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background-color: #f9fafb;
          border-radius: 6px;
        }

        .finding-icon,
        .security-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          font-size: 1.25rem;
        }

        .security-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .security-title {
          font-weight: 600;
          color: #b91c1c;
        }

        .security-description {
          color: #4b5563;
          font-size: 0.875rem;
        }

        .ocr-data table {
          width: 100%;
          border-collapse: collapse;
        }

        .ocr-data tr {
          border-bottom: 1px solid #e5e7eb;
        }

        .ocr-data tr:last-child {
          border-bottom: none;
        }

        .ocr-data td {
          padding: 0.75rem;
        }

        .field-name {
          font-weight: 600;
          color: #4b5563;
          width: 30%;
        }

        .field-value {
          width: 60%;
        }

        .field-match {
          width: 10%;
          text-align: center;
        }

        .match-yes {
          color: #059669;
          font-weight: bold;
        }

        .match-no {
          color: #dc2626;
          font-weight: bold;
        }

        .high .confidence-fill {
          background-color: white;
        }

        .medium .confidence-fill {
          background-color: rgba(255, 255, 255, 0.85);
        }

        .low .confidence-fill {
          background-color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default VerificationResults;
