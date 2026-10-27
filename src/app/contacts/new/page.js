"use client";

import { useRouter } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { useStore } from "@/lib/store";

export default function NewContactPage() {
  const router = useRouter();
  const { state, upsertContact, t } = useStore();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("contacts.newTitle")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("contacts.newLead")}</p>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <ContactForm
          nodes={state.geoNodes}
          t={t}
          onCancel={() => router.push("/contacts")}
          onSubmit={(data) => {
            const id = upsertContact(data);
            router.push(`/contacts/${id}`);
          }}
        />
      </div>
    </div>
  );
}
