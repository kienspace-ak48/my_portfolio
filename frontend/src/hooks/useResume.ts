import { useEffect, useState } from "react";
import { fetchPublicResume } from "../api/resume.api";
import {
  RESUME_CONTACT,
  RESUME_EXPERIENCE,
  RESUME_PROFILE,
  RESUME_QUICK_FACTS,
  RESUME_SCOPE,
  RESUME_SKILL_GROUPS,
  RESUME_SNAPSHOT,
} from "../data/resumeContent";
import type { ResumePublicData } from "../types/resume";

const FALLBACK: ResumePublicData = {
  profile: RESUME_PROFILE,
  contact: RESUME_CONTACT,
  quickFacts: RESUME_QUICK_FACTS,
  snapshot: RESUME_SNAPSHOT,
  scope: RESUME_SCOPE,
  experience: RESUME_EXPERIENCE,
  skillGroups: RESUME_SKILL_GROUPS,
  cvPdfUrl: null,
  cvPdfFileName: null,
};

export function useResume() {
  const [data, setData] = useState<ResumePublicData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicResume()
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setData(FALLBACK);
          setError("Không tải được dữ liệu resume — hiển thị mặc định.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
