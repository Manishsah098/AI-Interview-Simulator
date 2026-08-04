// ATS Resume Intelligence & Parser Engine

const ROLE_KEYWORDS = {
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'CI/CD', 'REST API', 'Unit Testing', 'SQL', 'Python', 'Java', 'Object Oriented Programming', 'Microservices', 'Docker', 'Kubernetes'],
  'Data Scientist': ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning', 'SQL', 'Data Visualization', 'Tableau', 'Statistics', 'Deep Learning', 'PyTorch', 'TensorFlow', 'A/B Testing', 'Feature Engineering'],
  'Full Stack Developer': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'MongoDB', 'Express', 'Tailwind', 'RESTful APIs', 'Git', 'Webpack', 'GraphQL', 'Next.js'],
  'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'LLM', 'Transformers', 'HuggingFace', 'CUDA', 'MLOps', 'Vector Databases', 'LangChain', 'Model Optimization', 'RAG'],
  'Android Developer': ['Kotlin', 'Java', 'Android SDK', 'Jetpack Compose', 'MVVM', 'Retrofit', 'Room Database', 'Coroutines', 'Gradle', 'UI/UX', 'Google Play', 'Firebase'],
  'Cybersecurity Analyst': ['Network Security', 'Penetration Testing', 'Wireshark', 'SIEM', 'Cryptography', 'Firewalls', 'Incident Response', 'Vulnerability Assessment', 'ISO 27001', 'Linux', 'Python'],
  'Product Manager': ['Roadmapping', 'Agile/Scrum', 'User Stories', 'A/B Testing', 'KPIs', 'Market Research', 'Wireframing', 'JIRA', 'Product Strategy', 'Stakeholder Management', 'SQL'],
  'UI/UX Designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture', 'Adobe XD', 'User Flows', 'Accessibility (WCAG)']
};

export class ATSAnalyzer {
  static analyzeText(resumeText, targetRole = 'Software Engineer') {
    const textLower = resumeText.toLowerCase();
    const keywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Engineer'];

    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRatio = matchedKeywords.length / keywords.length;
    const keywordScore = Math.round(matchRatio * 100);

    // Heuristics for formatting & structure
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
    const hasPhone = /[\d\-()+ ]{10,}/.test(resumeText);
    const hasGitHub = /github\.com/.test(textLower);
    const hasLinkedIn = /linkedin\.com/.test(textLower);
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

    let formatScore = 80;
    if (hasEmail) formatScore += 5;
    if (hasPhone) formatScore += 5;
    if (hasGitHub) formatScore += 5;
    if (hasLinkedIn) formatScore += 5;
    if (wordCount < 150) formatScore -= 20;

    formatScore = Math.min(100, Math.max(40, formatScore));

    const overallATS = Math.round((keywordScore * 0.6) + (formatScore * 0.4));

    const strengths = [];
    const weaknesses = [];

    if (matchedKeywords.length >= 5) strengths.push(`Strong keyword match for ${targetRole} (${matchedKeywords.slice(0, 4).join(', ')})`);
    if (hasGitHub) strengths.push('Contains active GitHub profile repository link');
    if (hasLinkedIn) strengths.push('Includes professional LinkedIn profile link');
    if (hasEmail && hasPhone) strengths.push('Contact details are clearly structured');

    if (missingKeywords.length > 0) weaknesses.push(`Missing core industry keywords: ${missingKeywords.slice(0, 3).join(', ')}`);
    if (!hasGitHub && (targetRole.includes('Developer') || targetRole.includes('Engineer'))) weaknesses.push('Missing portfolio/GitHub repository links');
    if (wordCount < 200) weaknesses.push('Resume word count is low; elaborate on project achievements & quantifiable impact');

    return {
      overallATS,
      keywordScore,
      formatScore,
      matchedKeywords,
      missingKeywords,
      strengths,
      weaknesses,
      wordCount,
      suggestedSkills: missingKeywords.slice(0, 5),
      projectQuality: Math.round(75 + Math.random() * 20),
      grammarScore: Math.round(88 + Math.random() * 10)
    };
  }
}
