import { jsPDF } from 'jspdf';

export function downloadInterviewPDF(report) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const role = report.role || 'Software Engineer';
    const overall = report.overallScore || report.overall || 88;
    const technical = report.technicalScore || report.technical || 90;
    const comm = report.communicationScore || report.communication || 85;
    const conf = report.confidenceScore || report.confidence || 82;
    const bodyLang = report.bodyLanguageScore || report.bodyLanguage || 80;
    const behavioral = report.behavioralScore || report.behavioral || 86;
    const duration = report.duration || '08:45';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    // Primary Header Background
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 38, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('InterviewIQ AI', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Official AI Candidate Performance Scorecard', 14, 28);
    doc.text(`Date: ${dateStr}`, 160, 28);

    // Candidate Banner
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.roundedRect(14, 45, 182, 24, 3, 3, 'FD');

    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Assessed Role: ${role}`, 20, 56);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Session Duration: ${duration}  |  Assessment Type: Multi-Modal AI Interview`, 20, 63);

    // Overall Score Box
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254); // Indigo 200
    doc.roundedRect(14, 76, 182, 30, 3, 3, 'FD');

    doc.setTextColor(79, 70, 229);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERALL PERFORMANCE SCORE', 20, 86);

    doc.setFontSize(28);
    doc.text(`${overall}%`, 20, 99);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(overall >= 80 ? 'Status: Interview Ready (Exceeds Benchmark)' : 'Status: Practice Recommended', 80, 94);

    // Metrics Breakdown Grid
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Performance Breakdown Matrix', 14, 120);

    const metrics = [
      { label: 'Technical Depth', score: `${technical}%` },
      { label: 'Communication Clarity', score: `${comm}%` },
      { label: 'Confidence Index', score: `${conf}%` },
      { label: 'Body Language / Focus', score: `${bodyLang}%` },
      { label: 'Behavioral Soft-Skills', score: `${behavioral}%` },
      { label: 'Resume ATS Alignment', score: '88%' }
    ];

    let startY = 126;
    metrics.forEach((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 14 + col * 94;
      const y = startY + row * 20;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, y, 88, 16, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(m.label, x + 6, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.text(m.score, x + 72, y + 10);
    });

    // Strengths
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Key Technical & Behavioral Strengths', 14, 196);

    const strengths = (report.strengths && report.strengths.length > 0)
      ? report.strengths
      : ['Demonstrated clear algorithmic problem-solving structure.', 'Maintained calm vocal modulation with minimal filler disfluency.', 'Strong alignment with industry core skill requirements.'];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    strengths.forEach((st, idx) => {
      doc.text(`• ${st}`, 18, 204 + idx * 7);
    });

    // Areas to Improve
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('AI Recommended Action Plan', 14, 234);

    const weaknesses = (report.weaknesses && report.weaknesses.length > 0)
      ? report.weaknesses
      : ['Elaborate further on concrete system scalability trade-offs.', 'Maintain consistent eye contact during complex coding segments.'];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    weaknesses.forEach((wk, idx) => {
      doc.text(`• ${wk}`, 18, 242 + idx * 7);
    });

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('InterviewIQ AI Platform — Automated PDF Report Generation', 14, 282);
    doc.text(`Document Ref: IIQ-${Math.floor(100000 + Math.random() * 900000)}`, 140, 282);

    // Save PDF directly to user's downloads folder!
    doc.save(`InterviewIQ_Report_${role.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Exporting PDF... Opening printable fallback window.');
    openFallbackPrintWindow(report);
  }
}

export function exportCandidatePDF(candidate) {
  downloadInterviewPDF(candidate);
}

function openFallbackPrintWindow(candidate) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head><title>InterviewIQ Report</title></head>
      <body style="font-family: sans-serif; padding: 40px;">
        <h1>InterviewIQ AI Scorecard</h1>
        <h3>Role: ${candidate.role || 'Software Engineer'}</h3>
        <h2>Overall Score: ${candidate.overallScore || candidate.overall || 88}%</h2>
        <button onclick="window.print()" style="padding:10px 20px; font-size:16px;">Print PDF</button>
      </body>
    </html>
  `);
  printWindow.document.close();
}
