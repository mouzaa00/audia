"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FormEvent, useEffect, useState } from "react";

const statuses = [
  "open",
  "planned",
  "in_progress",
  "quick_wins",
  "under_consideration",
];

export default function SubmitIdeaModal({ onClose }: { onClose: () => void }) {
  const currentUser = useQuery(api.ideas.getCurrentUser);
  const createIdea = useMutation(api.ideas.createIdea);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [submitter, setSubmitter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitter(currentUser.name ?? currentUser.email ?? "");
    }
  }, [currentUser]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createIdea({ title, description, status, submitter });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit idea");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/50"
        style={{ animation: "fade-in 0.2s ease-out" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative flex w-1/2 flex-col overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl"
        style={{ animation: "slide-in-right 0.35s ease-out" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Submit a Feature Idea
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-5 p-5"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Short, descriptive title"
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 placeholder:text-slate-400"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                placeholder="Describe the idea and why it would be valuable"
                className="resize-y rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 placeholder:text-slate-400"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Submitter
              </span>
              <input
                type="text"
                value={submitter}
                onChange={(e) => setSubmitter(e.target.value)}
                placeholder="Your name"
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 placeholder:text-slate-400"
              />
            </label>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                  {error}
                </p>
              </div>
            )}

            <div className="mt-auto flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Idea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
