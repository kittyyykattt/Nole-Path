export const awsApi = {
  async getJobMatches(userId: string) {
    const response = await fetch('/api/aws/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    if (!response.ok) throw new Error('Failed to fetch job matches');
    return response.json();
  },

  async getCareerCoaching(userId: string, question?: string) {
    const response = await fetch('/api/aws/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        question: question || 'What should I do to achieve my career goals?'
      })
    });
    if (!response.ok) throw new Error('Failed to fetch coaching plan');
    return response.json();
  },

  async getGapAnalysis(userId: string) {
    const response = await fetch('/api/aws/analyze-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    if (!response.ok) throw new Error('Failed to fetch gap analysis');
    return response.json();
  },

  async tailorResume(studentName: string, resumeFile: string, jobId: string) {
    const response = await fetch('/api/aws/tailor-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_name: studentName, resume_file: resumeFile, job_id: jobId })
    });
    if (!response.ok) throw new Error('Failed to tailor resume');
    return response.json();
  },

  async aggregateJobs() {
    const response = await fetch('/api/aws/aggregate-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (!response.ok) throw new Error('Failed to aggregate jobs');
    return response.json();
  }
};
