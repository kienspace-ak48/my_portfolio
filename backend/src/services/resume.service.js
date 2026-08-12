const resumeRepository = require("../repositories/resume.repository");
const { DEFAULT_RESUME_CONTENT } = require("../data/resumeDefaults.data");

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeContent(stored) {
  if (!stored || !isPlainObject(stored)) {
    return structuredClone(DEFAULT_RESUME_CONTENT);
  }

  return {
    profile: {
      ...DEFAULT_RESUME_CONTENT.profile,
      ...(stored.profile ?? {}),
      preferences:
        Array.isArray(stored.profile?.preferences) &&
        stored.profile.preferences.length > 0
          ? stored.profile.preferences
          : DEFAULT_RESUME_CONTENT.profile.preferences,
    },
    contact: { ...DEFAULT_RESUME_CONTENT.contact, ...(stored.contact ?? {}) },
    quickFacts:
      Array.isArray(stored.quickFacts) && stored.quickFacts.length > 0
        ? stored.quickFacts
        : DEFAULT_RESUME_CONTENT.quickFacts,
    snapshot:
      Array.isArray(stored.snapshot) && stored.snapshot.length > 0
        ? stored.snapshot
        : DEFAULT_RESUME_CONTENT.snapshot,
    scope:
      Array.isArray(stored.scope) && stored.scope.length > 0
        ? stored.scope
        : DEFAULT_RESUME_CONTENT.scope,
    experience:
      Array.isArray(stored.experience) && stored.experience.length > 0
        ? stored.experience
        : DEFAULT_RESUME_CONTENT.experience,
    skillGroups:
      Array.isArray(stored.skillGroups) && stored.skillGroups.length > 0
        ? stored.skillGroups
        : DEFAULT_RESUME_CONTENT.skillGroups,
  };
}

function serialize(row) {
  const content = mergeContent(row?.content);
  return {
    ...content,
    cvPdfUrl: row?.cvPdfUrl ?? null,
    cvPdfFileName: row?.cvPdfFileName ?? null,
  };
}

function validateContent(payload) {
  if (!payload || !isPlainObject(payload)) {
    throw new Error("Thiếu nội dung resume");
  }

  const required = ["profile", "contact"];
  for (const key of required) {
    if (!isPlainObject(payload[key])) {
      throw new Error(`Thiếu trường ${key}`);
    }
  }

  if (!payload.profile.name?.trim()) {
    throw new Error("Tên không được để trống");
  }

  if (!payload.contact.email?.trim()) {
    throw new Error("Email không được để trống");
  }

  return {
    profile: payload.profile,
    contact: payload.contact,
    quickFacts: Array.isArray(payload.quickFacts) ? payload.quickFacts : [],
    snapshot: Array.isArray(payload.snapshot) ? payload.snapshot : [],
    scope: Array.isArray(payload.scope) ? payload.scope : [],
    experience: Array.isArray(payload.experience) ? payload.experience : [],
    skillGroups: Array.isArray(payload.skillGroups) ? payload.skillGroups : [],
  };
}

const resumeService = {
  async getPublic() {
    const row = await resumeRepository.find();
    return serialize(row);
  },

  async getAdmin() {
    const row = await resumeRepository.find();
    return {
      content: mergeContent(row?.content),
      defaults: structuredClone(DEFAULT_RESUME_CONTENT),
      cvPdfUrl: row?.cvPdfUrl ?? null,
      cvPdfFileName: row?.cvPdfFileName ?? null,
      cvPdfPublicId: row?.cvPdfPublicId ?? null,
      hasCustomContent: Boolean(row?.content),
    };
  },

  async updateContent(payload) {
    const content = validateContent(payload);
    const row = await resumeRepository.upsert({ content });
    return serialize(row);
  },

  async updateCvFile({ url, fileName, publicId }) {
    const row = await resumeRepository.upsert({
      cvPdfUrl: url,
      cvPdfFileName: fileName,
      cvPdfPublicId: publicId,
    });
    return serialize(row);
  },

  async clearCvFile() {
    const row = await resumeRepository.upsert({
      cvPdfUrl: null,
      cvPdfFileName: null,
      cvPdfPublicId: null,
    });
    return serialize(row);
  },

  getStoredCvFileName(row) {
    return row?.cvPdfPublicId ?? null;
  },

  mergeContent,
  serialize,
};

module.exports = resumeService;
