import { useAtom } from "jotai";
import {
  aiStepAtom,
  aiPromptAtom,
  aiDraftAtom,
  aiSelectedTaskIdsAtom,
  aiLoadingAtom,
  aiErrorAtom,
} from "../constants/storeAiAtoms";

import { generateDraftFromPrompt } from "../components/AiComp/aiService";
import type { AiDraft } from "../components/AiComp/types";

export function useAiDraftGenerator() {
  const [step, setStep] = useAtom(aiStepAtom);
  const [prompt, setPrompt] = useAtom(aiPromptAtom);

  const [draft, setDraft] = useAtom(aiDraftAtom);
  const [selectedIds, setSelectedIds] = useAtom(aiSelectedTaskIdsAtom);

  const [loading, setLoading] = useAtom(aiLoadingAtom);
  const [error, setError] = useAtom(aiErrorAtom);

  const generate = async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res: AiDraft = await generateDraftFromPrompt(text);
      setDraft(res);

      if (res.type === "list") {
        setSelectedIds(res.tasks.map((t) => t.id)); // select all
      } else {
        setSelectedIds([]); // does not apply to task
      }

      setStep("preview");
    } catch (e: any) {
      setError(e?.message ?? "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setSelectedIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const reset = () => {
    setStep("prompt");
    setPrompt("");
    setDraft(null);
    setSelectedIds([]);
    setError(null);
    setLoading(false);
  };

  return {
    step,
    prompt,
    setPrompt,
    draft,
    selectedIds,
    loading,
    error,
    generate,
    toggleTask,
    reset,
  };
}
