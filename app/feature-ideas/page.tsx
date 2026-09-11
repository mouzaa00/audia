"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const statusStyles: Record<string, string> = {
  open: "border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300",
  planned:
    "border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  in_progress:
    "border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  quick_wins:
    "border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
  under_consideration:
    "border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
};

export default function FeatureIdeasPage() {
  const ideas = useQuery(api.ideas.listIdeas);

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Feature Ideas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Vote on ideas to help us prioritize what to build next
        </p>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {ideas === undefined ? (
          <div className="flex items-center gap-2 py-12 justify-center">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No ideas yet. Be the first to submit one!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea._id}
                title={idea.title}
                description={idea.description}
                status={idea.status}
                submitter={idea.submitter}
                upvotesCount={idea.upvotesCount}
                commentsCount={idea.commentsCount}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function IdeaCard({
  title,
  description,
  status,
  submitter,
  upvotesCount,
  commentsCount,
}: {
  title: string;
  description: string;
  status: string;
  submitter: string;
  upvotesCount: number;
  commentsCount: number;
}) {
  return (
    <div className="flex gap-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <button
        type="button"
        aria-label={`Upvote ${title}`}
        className="group flex h-fit min-w-14 flex-col items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-slate-500 transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:bg-orange-950/30 dark:hover:text-orange-400 dark:focus-visible:ring-offset-slate-800"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 15 6-6 6 6" />
        </svg>
        <span className="text-sm font-bold leading-none tabular-nums">
          {upvotesCount}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-snug text-base">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {submitter}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md capitalize ${
              statusStyles[status] ?? statusStyles.open
            }`}
          >
            {status.replace("_", " ")}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-auto">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {commentsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
