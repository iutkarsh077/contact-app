"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createSeedState } from "@/data/seed";
import { contactInArea } from "@/lib/geo";

export const STORAGE_KEY = "contact-app-poc-v1";
export const ROLE_KEY = "contact-app-poc-role";

function uid() {
  return crypto.randomUUID();
}

function loadState() {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return { ...createSeedState(), ...parsed };
  } catch {
    return createSeedState();
  }
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => createSeedState());
  const [role, setRoleState] = useState("staff");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    const saved = localStorage.getItem(ROLE_KEY);
    if (saved === "public" || saved === "staff") setRoleState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) persist(state);
  }, [state, ready]);

  const api = useMemo(() => {
    if (!state) return null;

    const update = (fn) => {
      setState((prev) => {
        const next = fn(prev);
        return next;
      });
    };

    return {
      state,
      role,
      setRole: (next) => {
        setRoleState(next);
        localStorage.setItem(ROLE_KEY, next);
      },
      reset: () => setState(createSeedState()),
      upsertContact: (contact) => {
        const record = {
          pinned: false,
          createdAt: new Date().toISOString(),
          ...contact,
          id: contact.id || uid(),
        };
        update((s) => {
          const exists = s.contacts.some((c) => c.id === record.id);
          return {
            ...s,
            contacts: exists
              ? s.contacts.map((c) => (c.id === record.id ? { ...c, ...record } : c))
              : [record, ...s.contacts],
          };
        });
        return record.id;
      },
      deleteContact: (id) =>
        update((s) => ({
          ...s,
          contacts: s.contacts.filter((c) => c.id !== id),
          notes: s.notes.filter((n) => n.contactId !== id),
          appointments: s.appointments.map((a) =>
            a.contactId === id ? { ...a, contactId: "" } : a,
          ),
        })),
      togglePin: (id) =>
        update((s) => ({
          ...s,
          contacts: s.contacts.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c,
          ),
        })),
      addNote: (contactId, text) =>
        update((s) => ({
          ...s,
          notes: [
            {
              id: uid(),
              contactId,
              text,
              createdAt: new Date().toISOString(),
            },
            ...s.notes,
          ],
        })),
      deleteNote: (id) =>
        update((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      upsertAppointment: (appt) => {
        const record = {
          createdAt: new Date().toISOString(),
          documentName: "",
          documentDataUrl: "",
          contactId: "",
          ...appt,
          id: appt.id || uid(),
        };
        update((s) => {
          const exists = s.appointments.some((a) => a.id === record.id);
          return {
            ...s,
            appointments: exists
              ? s.appointments.map((a) => (a.id === record.id ? record : a))
              : [record, ...s.appointments],
          };
        });
      },
      deleteAppointment: (id) =>
        update((s) => ({
          ...s,
          appointments: s.appointments.filter((a) => a.id !== id),
        })),
      addVolunteer: (vol) =>
        update((s) => ({
          ...s,
          volunteers: [
            {
              id: uid(),
              status: "pending",
              createdAt: new Date().toISOString(),
              ...vol,
            },
            ...s.volunteers,
          ],
        })),
      setVolunteerStatus: (id, status) =>
        update((s) => ({
          ...s,
          volunteers: s.volunteers.map((v) =>
            v.id === id ? { ...v, status } : v,
          ),
        })),
      addVisit: (visit) =>
        update((s) => ({
          ...s,
          visits: [
            {
              id: uid(),
              createdAt: new Date().toISOString(),
              ...visit,
            },
            ...s.visits,
          ],
        })),
      deleteVisit: (id) =>
        update((s) => ({ ...s, visits: s.visits.filter((v) => v.id !== id) })),
      addRequest: (req) =>
        update((s) => ({
          ...s,
          requests: [
            {
              id: uid(),
              status: "open",
              createdAt: new Date().toISOString(),
              ...req,
            },
            ...s.requests,
          ],
        })),
      setRequestStatus: (id, status) =>
        update((s) => ({
          ...s,
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
        })),
      inArea: (geoPath, areaId) =>
        contactInArea(state.geoNodes, geoPath, areaId),
    };
  }, [state, role]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
