
export interface AuditBreakdownItem {
  category: string;
  score: number;
  comment: string;
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface AuditResult {
  overallScore: number;
  auditBreakdown: AuditBreakdownItem[];
  recommendations: Recommendation[];
}
