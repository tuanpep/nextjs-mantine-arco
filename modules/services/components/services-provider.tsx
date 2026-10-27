"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  seedRequests,
  updateRequest,
  validateRequest,
  type QueueAction,
  type RequestDraft,
  type ServiceRequest,
} from "../lib/services";

type ServicesContextValue = {
  requests: ServiceRequest[];
  submitRequest: (draft: RequestDraft) => string;
  actOnRequest: (id: string, action: QueueAction) => void;
};
const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState(seedRequests);

  function submitRequest(draft: RequestDraft) {
    if (Object.keys(validateRequest(draft)).length)
      throw new Error("Check the required request fields.");
    const id = `SR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const request: ServiceRequest = {
      ...draft,
      application: draft.application.trim(),
      justification: draft.justification.trim(),
      id,
      assignee: "",
      status: "Submitted",
      history: [
        {
          at: new Date().toISOString(),
          actor: "You",
          message: "Submitted request. Pending DX triage and owner review.",
        },
      ],
    };
    setRequests((current) => [request, ...current]);
    return id;
  }

  function actOnRequest(id: string, action: QueueAction) {
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Request not found.");
    const updated = updateRequest(request, action, new Date().toISOString());
    setRequests((current) =>
      current.map((item) => (item.id === id ? updated : item)),
    );
  }

  return (
    <ServicesContext.Provider value={{ requests, submitRequest, actOnRequest }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) throw new Error("ServicesProvider must wrap the workspace.");
  return context;
}
