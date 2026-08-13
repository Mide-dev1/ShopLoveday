"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NIGERIA_STATES } from "@/data/nigeria-states";

type Address = {
    id: string;
    label: string;
    recipient_name: string;
    recipient_phone: string;
    address_line: string;
    city: string;
    state: string;
    is_default: boolean;
};

export default function AddressManager({ userId }: { userId: string }) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    async function loadAddresses() {
        const { data } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", userId)
            .order("is_default", { ascending: false });
        setAddresses(data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        loadAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    async function handleDelete(id: string) {
        await supabase.from("addresses").delete().eq("id", id);
        loadAddresses();
    }

    async function handleSetDefault(id: string) {
        // Clear the old default first, then set the new one — two simple
        // queries rather than a single complex one, easy to reason about.
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
        await supabase.from("addresses").update({ is_default: true }).eq("id", id);
        loadAddresses();
    }

    return (
        <div>
            {loading ? (
                <p className="font-body text-sm text-muted">Loading addresses...</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="rounded-2xl border border-line p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-body text-sm text-ink">
                                        {addr.label} {addr.is_default && <span className="text-muted">(default)</span>}
                                    </p>
                                    <p className="mt-1 font-body text-sm text-muted">
                                        {addr.recipient_name} · {addr.recipient_phone}
                                    </p>
                                    <p className="mt-1 font-body text-sm text-muted">
                                        {addr.address_line}, {addr.city}, {addr.state}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-4">
                                {!addr.is_default && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="font-body text-xs text-ink underline"
                                    >
                                        Set as default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="font-body text-xs text-muted underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <p className="font-body text-sm text-muted">No saved addresses yet.</p>
                    )}
                </div>
            )}

            {showForm ? (
                <AddressForm
                    userId={userId}
                    isFirst={addresses.length === 0}
                    onDone={() => {
                        setShowForm(false);
                        loadAddresses();
                    }}
                />
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 w-full rounded-full border border-line py-3 font-body text-sm uppercase tracking-wide text-ink transition-colors hover:bg-line"
                >
                    + Add new address
                </button>
            )}
        </div>
    );
}

function AddressForm({
    userId,
    isFirst,
    onDone,
}: {
    userId: string;
    isFirst: boolean;
    onDone: () => void;
}) {
    const [label, setLabel] = useState("Home");
    const [recipientName, setRecipientName] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState(NIGERIA_STATES[0]);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        await supabase.from("addresses").insert({
            user_id: userId,
            label,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            address_line: addressLine,
            city,
            state,
            is_default: isFirst, // first address a person adds becomes default automatically
        });
        setSaving(false);
        onDone();
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 rounded-2xl border border-line p-5">
            <input
                required
                placeholder="Label (e.g. Home, Work)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <input
                required
                placeholder="Recipient's full name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <input
                required
                type="tel"
                placeholder="Recipient's phone number"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <input
                required
                placeholder="Street address"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <div className="flex gap-3">
                <input
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                />
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex-1 rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none"
                >
                    {NIGERIA_STATES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="mt-2 rounded-full bg-ink py-3 font-body text-sm font-medium uppercase tracking-wide text-paper disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save address"}
            </button>
        </form>
    );
}
