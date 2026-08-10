import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSeedCommentsForPost,
  loadLocalComments,
  saveLocalComments,
} from "../data/blogComments";
import type { BlogComment, BlogCommentSort } from "../types/blog";

function mergeComments(postId: string) {
  const local = loadLocalComments();
  const seed = getSeedCommentsForPost(postId).map((c) => ({
    ...c,
    likes: local.likeOverrides[c.id] ?? c.likes,
  }));
  const localForPost = local.comments
    .filter((c) => c.postId === postId)
    .map((c) => ({
      ...c,
      likes: local.likeOverrides[c.id] ?? c.likes,
    }));
  const ids = new Set(localForPost.map((c) => c.id));
  const merged = [
    ...seed.filter((c) => !ids.has(c.id)),
    ...localForPost,
  ];
  return {
    comments: merged,
    likedIds: local.likedIds,
    likeOverrides: local.likeOverrides,
  };
}

function sortComments(comments: BlogComment[], sort: BlogCommentSort) {
  const sorted = [...comments];
  if (sort === "oldest") {
    sorted.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  } else if (sort === "popular") {
    sorted.sort((a, b) => b.likes - a.likes);
  } else {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return sorted;
}

function newCommentId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function avatarFromName(name: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(name.trim())}`;
}

function useBlogComments(postId: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>(
    {},
  );
  const [sort, setSort] = useState<BlogCommentSort>("newest");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { comments: merged, likedIds: liked, likeOverrides: overrides } =
      mergeComments(postId);
    setComments(merged);
    setLikedIds(new Set(liked));
    setLikeOverrides(overrides);
    setReady(true);
  }, [postId]);

  const persistLocal = useCallback(
    (
      nextComments: BlogComment[],
      nextLiked: Set<string>,
      overrides: Record<string, number>,
    ) => {
      const allLocal = loadLocalComments();
      const otherPosts = allLocal.comments.filter((c) => c.postId !== postId);
      const thisPostLocal = nextComments.filter((c) =>
        c.id.startsWith("local-"),
      );
      saveLocalComments({
        comments: [...otherPosts, ...thisPostLocal],
        likedIds: [...nextLiked],
        likeOverrides: overrides,
      });
    },
    [postId],
  );

  const topLevel = useMemo(() => {
    const roots = comments.filter((c) => c.parentId === null);
    return sortComments(roots, sort);
  }, [comments, sort]);

  const repliesByParent = useMemo(() => {
    const map = new Map<string, BlogComment[]>();
    for (const c of comments) {
      if (!c.parentId) continue;
      const list = map.get(c.parentId) ?? [];
      list.push(c);
      map.set(c.parentId, list);
    }
    for (const [, list] of map) {
      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    return map;
  }, [comments]);

  const addComment = useCallback(
    (input: { authorName: string; authorEmail?: string; content: string }) => {
      const comment: BlogComment = {
        id: newCommentId(),
        postId,
        parentId: null,
        authorName: input.authorName.trim(),
        authorEmail: input.authorEmail?.trim() || undefined,
        avatarUrl: avatarFromName(input.authorName),
        content: input.content.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setComments((prev) => {
        const next = [...prev, comment];
        persistLocal(next, likedIds, likeOverrides);
        return next;
      });
      return comment;
    },
    [postId, likedIds, likeOverrides, persistLocal],
  );

  const addReply = useCallback(
    (
      parentId: string,
      input: { authorName: string; authorEmail?: string; content: string },
    ) => {
      const comment: BlogComment = {
        id: newCommentId(),
        postId,
        parentId,
        authorName: input.authorName.trim(),
        authorEmail: input.authorEmail?.trim() || undefined,
        avatarUrl: avatarFromName(input.authorName),
        content: input.content.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setComments((prev) => {
        const next = [...prev, comment];
        persistLocal(next, likedIds, likeOverrides);
        return next;
      });
      return comment;
    },
    [postId, likedIds, likeOverrides, persistLocal],
  );

  const toggleLike = useCallback(
    (commentId: string) => {
      setLikedIds((prevLiked) => {
        const nextLiked = new Set(prevLiked);
        const wasLiked = nextLiked.has(commentId);
        if (wasLiked) nextLiked.delete(commentId);
        else nextLiked.add(commentId);

        setComments((prev) => {
          const next = prev.map((c) => {
            if (c.id !== commentId) return c;
            const newLikes = Math.max(0, c.likes + (wasLiked ? -1 : 1));
            return { ...c, likes: newLikes };
          });
          const overrides = { ...likeOverrides };
          const updated = next.find((c) => c.id === commentId);
          if (updated) overrides[commentId] = updated.likes;
          setLikeOverrides(overrides);
          persistLocal(next, nextLiked, overrides);
          return next;
        });

        return nextLiked;
      });
    },
    [likeOverrides, persistLocal],
  );

  const totalCount = comments.length;

  return {
    ready,
    sort,
    setSort,
    topLevel,
    repliesByParent,
    totalCount,
    likedIds,
    addComment,
    addReply,
    toggleLike,
  };
}

export default useBlogComments;
