"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getRegistryReferences,
  referencesEqual,
  type ResponsibilityReferences,
} from "../lib/project-settings";

type ProjectSettingsState = {
  applied: ResponsibilityReferences;
  draft: ResponsibilityReferences;
  source: "registry" | "session";
};

type ProjectSettingsStore = {
  get: (projectId: string) => ProjectSettingsState | undefined;
  edit: (projectId: string, draft: ResponsibilityReferences) => void;
  apply: (projectId: string) => void;
  discard: (projectId: string) => void;
  confirmLeave: (projectId: string) => boolean;
};

const ProjectSettingsContext = createContext<ProjectSettingsStore | null>(null);

export function ProjectSettingsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<
    Partial<Record<string, ProjectSettingsState>>
  >({});
  const hasUnsavedChanges = Object.values(projects).some(
    (state) => state && !referencesEqual(state.applied, state.draft),
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [hasUnsavedChanges]);

  function get(projectId: string): ProjectSettingsState | undefined {
    const references = getRegistryReferences(projectId);
    if (!references) return undefined;
    return (
      projects[projectId] ?? {
        applied: references,
        draft: references,
        source: "registry",
      }
    );
  }

  function edit(projectId: string, draft: ResponsibilityReferences) {
    const state = get(projectId);
    if (!state) return;
    setProjects((current) => ({
      ...current,
      [projectId]: { ...state, draft },
    }));
  }

  function apply(projectId: string) {
    setProjects((current) => {
      const state = current[projectId];
      if (!state) return current;
      return {
        ...current,
        [projectId]: { ...state, applied: state.draft, source: "session" },
      };
    });
  }

  function discard(projectId: string) {
    setProjects((current) => {
      const state = current[projectId];
      if (!state) return current;
      return {
        ...current,
        [projectId]: { ...state, draft: state.applied },
      };
    });
  }

  function confirmLeave(projectId: string): boolean {
    const state = get(projectId);
    if (!state || referencesEqual(state.applied, state.draft)) return true;
    if (
      !window.confirm(
        "Bỏ các thay đổi thông tin tham chiếu chưa lưu của dự án này? Chọn Hủy để giữ nội dung đã sửa.",
      )
    ) {
      return false;
    }
    discard(projectId);
    return true;
  }

  return (
    <ProjectSettingsContext.Provider
      value={{ get, edit, apply, discard, confirmLeave }}
    >
      {children}
    </ProjectSettingsContext.Provider>
  );
}

export function useProjectSettings() {
  const store = useContext(ProjectSettingsContext);
  if (!store) {
    throw new Error("Project settings require ProjectSettingsProvider.");
  }
  return store;
}
