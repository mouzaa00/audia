"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function SandboxPage() {
  const seedIdeas = useMutation(api.seed.seedIdeas);

  return <button onClick={() => seedIdeas()}>Seed DB</button>;
}
