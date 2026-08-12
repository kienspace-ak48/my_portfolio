export type ResumeContact = {
  email: string;
  github: string;
  githubLabel: string;
  location: string;
  responseTime: string;
};

export type ResumeQuickFact = {
  label: string;
  value: string;
};

export type ResumeSnapshot = {
  value: string;
  label: string;
};

export type ResumeScope = {
  id: string;
  area: string;
  detail: string;
};

export type ResumeExperience = {
  id: string;
  period: string;
  role: string;
  company: string;
  context: string;
  bullets: string[];
  tags: string[];
  projectHref?: string;
};

export type ResumeSkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type ResumeProfile = {
  name: string;
  title: string;
  focus: string;
  availability: string;
  avatarUrl: string;
  intro: string;
  preferencesIntro: string;
  preferences: string[];
};

export type ResumeContent = {
  profile: ResumeProfile;
  contact: ResumeContact;
  quickFacts: ResumeQuickFact[];
  snapshot: ResumeSnapshot[];
  scope: ResumeScope[];
  experience: ResumeExperience[];
  skillGroups: ResumeSkillGroup[];
};

export type ResumePublicData = ResumeContent & {
  cvPdfUrl: string | null;
  cvPdfFileName: string | null;
};

export type ResumeAdminData = {
  content: ResumeContent;
  defaults: ResumeContent;
  cvPdfUrl: string | null;
  cvPdfFileName: string | null;
  cvPdfPublicId: string | null;
  hasCustomContent: boolean;
};

export type ResumeSectionLink = {
  id: string;
  label: string;
};

export const RESUME_SECTIONS: ResumeSectionLink[] = [
  { id: "intro", label: "Giới thiệu" },
  { id: "scope", label: "Phạm vi làm việc" },
  { id: "experience", label: "Dự án & kinh nghiệm" },
  { id: "skills", label: "Công nghệ" },
  { id: "preferences", label: "Mong muốn" },
];
