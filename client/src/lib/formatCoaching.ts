export function formatItemList(items: any[], labelKey: string, fallbackKeys: string[]): string[] {
  const lines: string[] = [];
  items.forEach((item: any, i: number) => {
    if (typeof item === 'string') {
      lines.push(`${i + 1}. ${item}`);
    } else if (item && typeof item === 'object') {
      const label = item[labelKey] || fallbackKeys.reduce((acc, k) => acc || item[k], '') || 'Item';
      lines.push(`${i + 1}. **${label}**`);
      if (item.timeline) lines.push(`   Timeline: ${item.timeline}`);
      if (item.priority) lines.push(`   Priority: ${item.priority}`);
      if (item.why) lines.push(`   Why: ${item.why}`);
      if (item.why_critical) lines.push(`   Why: ${item.why_critical}`);
      if (item.steps && Array.isArray(item.steps)) {
        item.steps.forEach((step: string) => {
          lines.push(`   - ${step}`);
        });
      }
    }
    lines.push("");
  });
  return lines;
}

export function formatCoachingResponse(data: any): string {
  const parts: string[] = [];
  const plan = (data.coaching_plan && typeof data.coaching_plan === 'object') ? data.coaching_plan : data;

  parts.push("Here's your personalized career roadmap:\n");

  const shortTerm = plan.short_term_checklist || data.short_term_checklist;
  if (shortTerm && Array.isArray(shortTerm) && shortTerm.length > 0) {
    parts.push("**Short-Term Actions (This Week/Month)**\n");
    parts.push(...formatItemList(shortTerm, 'task', ['action', 'title']));
  }

  const longTerm = plan.long_term_checklist || data.long_term_checklist;
  if (longTerm && Array.isArray(longTerm) && longTerm.length > 0) {
    parts.push("**Long-Term Milestones**\n");
    parts.push(...formatItemList(longTerm, 'milestone', ['goal', 'task', 'title']));
  }

  const courses = plan.recommended_fsu_courses || data.recommended_fsu_courses;
  if (courses && Array.isArray(courses) && courses.length > 0) {
    parts.push("**Recommended FSU Courses**");
    courses.forEach((c: string) => parts.push(`- ${c}`));
    parts.push("");
  }

  const certs = plan.recommended_certifications || data.recommended_certifications;
  if (certs && Array.isArray(certs) && certs.length > 0) {
    parts.push("**Certifications to Pursue**");
    certs.forEach((c: string) => parts.push(`- ${c}`));
    parts.push("");
  }

  const internship = plan.internship_strategy || data.internship_strategy;
  if (internship && typeof internship === 'object') {
    parts.push("**Internship Strategy**");
    if (internship.target_companies && Array.isArray(internship.target_companies)) {
      parts.push(`Target Companies: ${internship.target_companies.join(", ")}`);
    }
    if (internship.when_to_apply) {
      parts.push(`When to Apply: ${internship.when_to_apply}`);
    }
    if (internship.application_tips && Array.isArray(internship.application_tips)) {
      parts.push("Application Tips:");
      internship.application_tips.forEach((tip: string) => parts.push(`- ${tip}`));
    }
    parts.push("");
  }

  const strategy = plan.overall_strategy || data.overall_strategy;
  if (strategy && typeof strategy === 'string') {
    parts.push(`**Overall Strategy:** ${strategy}\n`);
  }

  if (data.response && typeof data.response === 'string' && !data.coaching_plan) {
    parts.push(data.response);
  }

  if (parts.length <= 1) {
    if (typeof data === 'string') {
      return data;
    }
    if (data.response && typeof data.response === 'string') {
      return data.response;
    }
    return "I've analyzed your profile. Let me know what specific area you'd like to focus on.";
  }

  return parts.join("\n");
}

export function formatGapAnalysis(data: any): { summary: string; gaps: string[]; strengths: string[] } {
  const gaps: string[] = [];
  const strengths: string[] = [];
  let summary = "";

  if (data?.gap_analysis && typeof data.gap_analysis === 'object') {
    const analysis = data.gap_analysis;
    if (analysis.missing_skills && Array.isArray(analysis.missing_skills)) {
      gaps.push(...analysis.missing_skills);
    }
    if (analysis.skill_gaps && Array.isArray(analysis.skill_gaps)) {
      analysis.skill_gaps.forEach((g: any) => {
        if (typeof g === 'string') gaps.push(g);
        else if (g?.skill) gaps.push(g.skill);
      });
    }
    if (analysis.current_strengths && Array.isArray(analysis.current_strengths)) {
      strengths.push(...analysis.current_strengths);
    }
    if (analysis.strong_skills && Array.isArray(analysis.strong_skills)) {
      strengths.push(...analysis.strong_skills);
    }
    if (analysis.summary && typeof analysis.summary === 'string') {
      summary = analysis.summary;
    }
    if (analysis.overall_assessment && typeof analysis.overall_assessment === 'string') {
      summary = analysis.overall_assessment;
    }
  }

  if (data?.missing_skills && Array.isArray(data.missing_skills) && gaps.length === 0) {
    gaps.push(...data.missing_skills);
  }
  if (data?.skill_gaps && Array.isArray(data.skill_gaps) && gaps.length === 0) {
    data.skill_gaps.forEach((g: any) => {
      if (typeof g === 'string') gaps.push(g);
      else if (g?.skill) gaps.push(g.skill);
    });
  }
  if (data?.current_strengths && Array.isArray(data.current_strengths) && strengths.length === 0) {
    strengths.push(...data.current_strengths);
  }

  return { summary, gaps, strengths };
}
