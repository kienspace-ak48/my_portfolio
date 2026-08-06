import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { StoryGroup } from "../utils/storyGroups";
import {
  formatTimeAgo,
  getStoryPreview,
  getUserAvatarUrl,
} from "../utils/storyGroups";

const IMAGE_DURATION_MS = 5000;

interface Props {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

type SideSize = "near" | "far";

const SIDE_SIZE: Record<
  SideSize,
  { wrap: string; avatar: string; name: string; time: string }
> = {
  near: {
    wrap: "h-[min(58vh,560px)] w-[148px]",
    avatar: "h-14 w-14",
    name: "text-xs",
    time: "text-[11px]",
  },
  far: {
    wrap: "h-[min(48vh,460px)] w-[118px] opacity-75",
    avatar: "h-11 w-11",
    name: "text-[11px]",
    time: "text-[10px]",
  },
};

function SidePreview({
  group,
  size,
  onClick,
}: {
  group: StoryGroup;
  size: SideSize;
  onClick: () => void;
}) {
  const latestStory = group.stories[group.stories.length - 1];
  const styles = SIDE_SIZE[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative hidden shrink-0 overflow-hidden rounded-xl lg:block ${styles.wrap}`}
    >
      <img
        src={getStoryPreview(latestStory)}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[1px]"
      />
      <div className="absolute inset-0 bg-black/60 transition group-hover:bg-black/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2">
        <div className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[2px]">
          <img
            src={getUserAvatarUrl(group.user.id)}
            alt={group.user.name}
            className={`${styles.avatar} rounded-full border border-black object-cover`}
          />
        </div>
        <span
          className={`max-w-full truncate font-semibold text-white ${styles.name}`}
        >
          {group.user.name}
        </span>
        <span className={`text-white/70 ${styles.time}`}>
          {formatTimeAgo(latestStory.createdAt)}
        </span>
      </div>
    </button>
  );
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3a3a3a] text-white hover:bg-[#4a4a4a] lg:flex"
      aria-label={direction === "left" ? "Người trước" : "Người tiếp theo"}
    >
      <Icon size={16} />
    </button>
  );
}

const StoryViewerModal: React.FC<Props> = ({
  groups,
  initialGroupIndex,
  onClose,
}) => {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const elapsedRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const currentGroup = groups[groupIndex];
  const story = currentGroup?.stories[storyIndex];

  const leftGroups = [
    groupIndex > 1 ? groups[groupIndex - 2] : null,
    groupIndex > 0 ? groups[groupIndex - 1] : null,
  ];
  const rightGroups = [
    groupIndex < groups.length - 1 ? groups[groupIndex + 1] : null,
    groupIndex < groups.length - 2 ? groups[groupIndex + 2] : null,
  ];

  const goNext = useCallback(() => {
    if (!currentGroup) return;

    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      return;
    }

    if (groupIndex < groups.length - 1) {
      setGroupIndex((prev) => prev + 1);
      setStoryIndex(0);
      return;
    }

    onClose();
  }, [currentGroup, groupIndex, groups.length, onClose, storyIndex]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
      return;
    }

    if (groupIndex > 0) {
      const previousGroup = groups[groupIndex - 1];
      setGroupIndex((prev) => prev - 1);
      setStoryIndex(previousGroup.stories.length - 1);
    }
  }, [groupIndex, groups, storyIndex]);

  const goToUser = useCallback((index: number) => {
    setGroupIndex(index);
    setStoryIndex(0);
  }, []);

  const togglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    setPaused(false);
  }, [groupIndex, storyIndex, story?.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || story?.mediaType !== "VIDEO") return;

    video.muted = muted;

    if (paused) {
      video.pause();
    } else {
      void video.play().catch(() => {});
    }
  }, [paused, muted, story?.id, story?.mediaType]);

  useEffect(() => {
    if (!story || story.mediaType !== "IMAGE") return;

    if (paused) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }

    const startedAt = Date.now() - elapsedRef.current;
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      elapsedRef.current = elapsed;
      const nextProgress = Math.min((elapsed / IMAGE_DURATION_MS) * 100, 100);
      setProgress(nextProgress);

      if (elapsed >= IMAGE_DURATION_MS) {
        goNext();
      }
    }, 50);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [story, goNext, paused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose, togglePause]);

  if (!story || !currentGroup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a]">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-30 text-white/90 hover:text-white"
        aria-label="Đóng"
      >
        <X size={28} />
      </button>

      <div className="flex h-full items-center justify-center gap-2 px-2 md:gap-3 md:px-4">
        {/* Left side previews */}
        <div className="flex items-center gap-2">
          {leftGroups[0] && (
            <SidePreview
              group={leftGroups[0]}
              size="far"
              onClick={() => goToUser(groupIndex - 2)}
            />
          )}
          {leftGroups[1] && (
            <SidePreview
              group={leftGroups[1]}
              size="near"
              onClick={() => goToUser(groupIndex - 1)}
            />
          )}
          {groupIndex > 0 && (
            <NavArrow direction="left" onClick={() => goToUser(groupIndex - 1)} />
          )}
        </div>

        {/* Active story */}
        <div className="relative h-[min(90vh,760px)] w-[min(420px,92vw)] shrink-0 overflow-hidden rounded-xl bg-black shadow-2xl">
          <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-2 pt-2">
            {currentGroup.stories.map((item, index) => (
              <div
                key={item.id}
                className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35"
              >
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
                  style={{
                    width:
                      index < storyIndex
                        ? "100%"
                        : index === storyIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3 pb-3 pt-5">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={getUserAvatarUrl(currentGroup.user.id)}
                alt={currentGroup.user.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <span className="truncate text-sm font-semibold text-white">
                {currentGroup.user.name}
              </span>
              <span className="shrink-0 text-sm text-white/70">
                {formatTimeAgo(story.createdAt)}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {story.mediaType === "VIDEO" && (
                <button
                  type="button"
                  onClick={() => setMuted((prev) => !prev)}
                  className="rounded-full p-1.5 text-white hover:bg-white/10"
                  aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}
              <button
                type="button"
                onClick={togglePause}
                className="rounded-full p-1.5 text-white hover:bg-white/10"
                aria-label={paused ? "Phát tiếp" : "Tạm dừng"}
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label="Story trước"
            className="absolute inset-y-0 left-0 z-10 w-[35%]"
            onClick={goPrev}
          />
          <button
            type="button"
            aria-label="Story tiếp theo"
            className="absolute inset-y-0 right-0 z-10 w-[35%]"
            onClick={goNext}
          />

          {story.mediaType === "VIDEO" ? (
            <video
              ref={videoRef}
              key={story.id}
              src={story.mediaUrl}
              className="h-full w-full object-cover"
              autoPlay={!paused}
              playsInline
              muted={muted}
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                if (video.duration) {
                  setProgress((video.currentTime / video.duration) * 100);
                }
              }}
              onEnded={goNext}
            />
          ) : (
            <img
              key={story.id}
              src={story.mediaUrl}
              className="h-full w-full object-cover"
              alt={currentGroup.user.name}
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
            <input
              readOnly
              placeholder={`Trả lời ${currentGroup.user.name}...`}
              className="min-w-0 flex-1 rounded-full border border-white/35 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/60"
            />
            <button
              type="button"
              className="shrink-0 text-white hover:text-white/80"
              aria-label="Thích"
            >
              <Heart size={22} />
            </button>
          </div>
        </div>

        {/* Right side previews */}
        <div className="flex items-center gap-2">
          {groupIndex < groups.length - 1 && (
            <NavArrow direction="right" onClick={() => goToUser(groupIndex + 1)} />
          )}
          {rightGroups[0] && (
            <SidePreview
              group={rightGroups[0]}
              size="near"
              onClick={() => goToUser(groupIndex + 1)}
            />
          )}
          {rightGroups[1] && (
            <SidePreview
              group={rightGroups[1]}
              size="far"
              onClick={() => goToUser(groupIndex + 2)}
            />
          )}
        </div>
      </div>

      {groupIndex > 0 && (
        <button
          type="button"
          onClick={() => goToUser(groupIndex - 1)}
          className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 lg:hidden"
          aria-label="Người trước"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {groupIndex < groups.length - 1 && (
        <button
          type="button"
          onClick={() => goToUser(groupIndex + 1)}
          className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 lg:hidden"
          aria-label="Người tiếp theo"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default StoryViewerModal;
