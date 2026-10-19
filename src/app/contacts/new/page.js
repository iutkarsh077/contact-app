"use client";

import { useRouter } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { useStore } from "@/lib/store";

export default function NewContactPage() {
  const router = useRouter();
  const { state, upsertContact } = useStore();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Add contact</h1>
      <p className="text-sm text-slate-600">
        New records go into the same centralized store.
      </p>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <ContactForm
          nodes={state.geoNodes}
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
