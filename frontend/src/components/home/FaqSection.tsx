import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { HOME_FAQS } from "../../data/homeContent";
import SectionHeader from "./SectionHeader";

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(HOME_FAQS[0]?.id ?? null);

  return (
    <section aria-labelledby="faq-heading">
      <SectionHeader title="Câu hỏi thường gặp" />
      <h2 id="faq-heading" className="sr-only">
        Câu hỏi thường gặp
      </h2>

      <div className="space-y-3">
        {HOME_FAQS.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-hover sm:px-5"
                aria-expanded={isOpen}
              >
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-ink sm:text-base">
                  {item.question}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-body sm:px-5 sm:pl-12">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqSection;
