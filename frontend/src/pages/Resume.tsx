import { Link } from "react-router-dom";
import ResumeBlock from "../components/resume/ResumeBlock";
import ResumeSidebar from "../components/resume/ResumeSidebar";
import ResumeTimeline from "../components/resume/ResumeTimeline";
import {
  RESUME_CONTACT,
  RESUME_EXPERIENCE,
  RESUME_PROFILE,
  RESUME_SCOPE,
  RESUME_SKILL_GROUPS,
} from "../data/resumeContent";

function Resume() {
  return (
    <div className="resume-brief pb-8">
      {/* Mobile header strip */}
      <header className="mb-6 rounded-2xl border border-border bg-[#101322] px-5 py-5 text-white lg:hidden">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.14em] text-white/50">
          Recruiter brief
        </p>
        <h1 className="mt-2 text-2xl font-bold">{RESUME_PROFILE.name}</h1>
        <p className="mt-1 text-sm text-white/75">
          {RESUME_PROFILE.title} — {RESUME_PROFILE.focus}
        </p>
        <p className="mt-2 text-xs text-white/55">{RESUME_PROFILE.availability}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-10 xl:gap-14">
        <ResumeSidebar />

        <main className="min-w-0">
          {/* Desktop page title */}
          <header className="mb-8 hidden border-b border-border pb-6 lg:block">
            <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-subtle">
              Recruiter brief · {RESUME_PROFILE.availability}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
              {RESUME_PROFILE.name}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
              Trang tóm lược nhanh — chi tiết kỹ thuật và demo nằm ở{" "}
              <Link to="/projects" className="font-medium text-brand hover:underline">
                mục Dự án
              </Link>
              .
            </p>
          </header>

          <div className="space-y-10">
            <ResumeBlock id="intro" index={1} title="Giới thiệu ngắn">
              <p className="text-base leading-[1.75] text-body sm:text-[17px]">
                {RESUME_PROFILE.intro}
              </p>
            </ResumeBlock>

            <ResumeBlock
              id="scope"
              index={2}
              title="Phạm vi làm việc"
              lead="Những phần tôi thường đảm nhận trong dự án — không phải cam kết làm hết mọi stack."
            >
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {RESUME_SCOPE.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-1 px-4 py-3.5 sm:grid-cols-[140px_1fr] sm:gap-4 sm:px-5"
                  >
                    <p className="text-sm font-semibold text-ink">{item.area}</p>
                    <p className="text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeBlock>

            <ResumeBlock
              id="experience"
              index={3}
              title="Dự án & kinh nghiệm"
              lead="Một vài dự án đã làm — mô tả ngắn, có thể hỏi sâu thêm khi trao đổi."
            >
              <ResumeTimeline items={RESUME_EXPERIENCE} />
            </ResumeBlock>

            <ResumeBlock id="skills" index={4} title="Công nghệ quen dùng">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {RESUME_SKILL_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="min-w-[min(100%,220px)] flex-1 rounded-xl border border-border bg-app/80 p-4"
                  >
                    <p className="font-mono-ui text-[11px] font-semibold uppercase tracking-wide text-subtle">
                      {group.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      {group.items.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeBlock>

            <ResumeBlock
              id="preferences"
              index={5}
              title="Mong muốn công việc"
              lead={RESUME_PROFILE.preferencesIntro}
            >
              <ul className="space-y-2">
                {RESUME_PROFILE.preferences.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-transparent px-1 py-1.5 text-sm text-body sm:text-[15px]"
                  >
                    <span
                      className="mt-2 h-1 w-4 shrink-0 rounded-full bg-brand/70"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 rounded-xl border border-dashed border-border-strong bg-surface px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Liên hệ trực tiếp</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {RESUME_CONTACT.responseTime}
                  </p>
                </div>
                <a
                  href={`mailto:${RESUME_CONTACT.email}?subject=Trao đổi vị trí - ${RESUME_PROFILE.name}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  {RESUME_CONTACT.email}
                </a>
              </div>
            </ResumeBlock>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Resume;
