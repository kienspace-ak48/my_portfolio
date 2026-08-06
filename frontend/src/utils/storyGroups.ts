import type { Story, StoryUser } from "../types/story";

export type StoryGroup = {
  user: StoryUser;
  stories: Story[];
};

export function groupStoriesByUser(stories: Story[]): StoryGroup[] {
  const map = new Map<number, StoryGroup>();

  for (const story of stories) {
    const existing = map.get(story.userId);
    if (existing) {
      existing.stories.push(story);
    } else {
      map.set(story.userId, {
        user: story.user,
        stories: [story],
      });
    }
  }

  const groups = Array.from(map.values());

  for (const group of groups) {
    group.stories.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  groups.sort((a, b) => {
    const latestA = a.stories[a.stories.length - 1]?.createdAt ?? "";
    const latestB = b.stories[b.stories.length - 1]?.createdAt ?? "";
    return new Date(latestB).getTime() - new Date(latestA).getTime();
  });

  return groups;
}

export function getStoryPreview(story: Story) {
  if (story.mediaType === "VIDEO") {
    return story.thumbnailUrl ?? story.mediaUrl;
  }
  return story.mediaUrl;
}

export function getUserAvatarUrl(userId: number) {
  return `https://i.pravatar.cc/150?u=${userId}`;
}

export function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ`;

  const days = Math.floor(hours / 24);
  return `${days} ngày`;
}
