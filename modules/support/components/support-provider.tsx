"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import {
  supportFixtures,
  type SupportContext,
  type SupportRequest,
} from "../lib/fixtures";
import {
  applySenderAction,
  applyHandlerAction,
  createSupportRequest,
  type SenderAction,
  type HandlerAction,
} from "../lib/support-state";

type SupportStore = {
  requests: SupportRequest[];
  create: (context: SupportContext, applicationId?: string | null) => string;
  respond: (id: string, action: SenderAction) => void;
  handle: (id: string, action: HandlerAction) => void;
};

const SupportContextStore = createContext<SupportStore | null>(null);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState(supportFixtures);

  function create(context: SupportContext, applicationId: string | null = "beacon-portal") {
    const id = `SUP-${crypto.randomUUID()}`;
    const item = createSupportRequest(id, context, applicationId);
    setRequests((current) => [item, ...current]);
    return id;
  }

  function respond(id: string, action: SenderAction) {
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? applySenderAction(item, action) : item,
      ),
    );
  }

  function handle(id: string, action: HandlerAction) {
    const item = requests.find((request) => request.id === id);
    if (!item) throw new Error("Issue not found.");
    const updated = applyHandlerAction(item, action);
    setRequests((current) =>
      current.map((request) => (request.id === id ? updated : request)),
    );
  }

  return (
    <SupportContextStore.Provider value={{ requests, create, respond, handle }}>
      {children}
    </SupportContextStore.Provider>
  );
}

export function useSupport() {
  const store = useContext(SupportContextStore);
  if (!store)
    throw new Error("Support screens must be wrapped in SupportProvider.");
  return store;
}
