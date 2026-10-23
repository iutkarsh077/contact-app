"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createSeedState } from "@/data/seed";
import { contactInArea } from "@/lib/geo";
import { isLocale, translate } from "@/i18n";

export const STORAGE_KEY = "contact-app-poc-v1";
export const ROLE_KEY = "contact-app-poc-role";
export const SESSION_KEY = "contact-app-poc-session";
export const ADMIN_SESSION_KEY = "contact-app-poc-admin";
export const LOCALE_KEY = "contact-app-poc-locale";

export const POC_ADMIN_EMAIL = "admin@poc.local";
export const POC_ADMIN_PASSWORD = "admin";

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
    return { ...createSeedState(), ...parsed, accounts: parsed.accounts || [] };
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
  const [sessionAccountId, setSessionAccountId] = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [locale, setLocaleState] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());

    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.accountId) setSessionAccountId(parsed.accountId);
      } catch {}
    }

    const savedAdmin = localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        if (parsed?.email) setAdminSession(parsed);
      } catch {}
    }

    const savedLocale = localStorage.getItem(LOCALE_KEY);
    if (isLocale(savedLocale)) setLocaleState(savedLocale);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) persist(state);
  }, [state, ready]);

  const session = useMemo(() => {
    if (!state?.accounts || !sessionAccountId) return null;
    return state.accounts.find((a) => a.id === sessionAccountId) || null;
  }, [state?.accounts, sessionAccountId]);

  const role = session?.role || null;

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
      session,
      adminSession,
      role,
      locale,
      ready,
      t: (key, vars) => translate(locale, key, vars),
      signUp: ({ role, name, phone, geoPath, termStart, termEnd }) => {
        const id = uid();
        const account = {
          id,
          createdAt: new Date().toISOString(),
          role,
          name,
          phone,
          geoPath,
          ...(role === "staff"
            ? {
                termStart,
                termEnd,
                status: "verified",
              }
            : {
                status: "verified",
              }),
        };
        update((s) => ({
          ...s,
          accounts: [...(s.accounts || []), account],
        }));
        setSessionAccountId(id);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ accountId: id }));
        return account;
      },
      login: (phone) => {
        const digits = String(phone).replace(/\D/g, "");
        const account = state.accounts?.find((a) => a.phone === digits);
        if (!account) return null;
        setSessionAccountId(account.id);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ accountId: account.id }));
        return account;
      },
      findAccountByPhone: (phone) => {
        const digits = String(phone).replace(/\D/g, "");
        return state.accounts?.find((a) => a.phone === digits) || null;
      },
      signOut: () => {
        setSessionAccountId(null);
        localStorage.removeItem(SESSION_KEY);
      },
      adminLogin: (email, password) => {
        if (
          email &&
          email.trim().toLowerCase() === POC_ADMIN_EMAIL.toLowerCase() &&
          password === POC_ADMIN_PASSWORD
        ) {
          const sessionObj = { email: POC_ADMIN_EMAIL };
          setAdminSession(sessionObj);
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionObj));
          return true;
        }
        return false;
      },
      adminLogout: () => {
        setAdminSession(null);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      },
      verifyAccount: (id) => {
        update((s) => ({
          ...s,
          accounts: (s.accounts || []).map((acc) =>
            acc.id === id ? { ...acc, status: "verified" } : acc,
          ),
        }));
      },
      setLocale: (next) => {
        if (!isLocale(next)) return;
        setLocaleState(next);
        localStorage.setItem(LOCALE_KEY, next);
      },
      reset: () =>
        setState((prev) => ({
          ...createSeedState(),
          accounts: prev.accounts || [],
        })),
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
  }, [state, session, adminSession, role, locale, ready]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
