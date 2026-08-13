"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
    id: string;
    status: string;
    total: number;
    created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
};

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString("en-NG")}`;
}

export default function OrdersTab({ userId }: { userId: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("orders")
            .select("id, status, total, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .then(({ data }) => {
                setOrders(data ?? []);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return <p className="font-body text-sm text-muted">Loading orders...</p>;
    }

    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-line p-6 text-center">
                <p className="font-body text-sm text-muted">
                    You haven&apos;t placed any orders yet. Once you check out, you&apos;ll be
                    able to track delivery progress right here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-line p-6">
                    <div className="flex items-center justify-between">
                        <p className="font-mono text-xs uppercase tracking-wide text-muted">
                            {new Date(order.created_at).toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                        <span className="rounded-full border border-line px-3 py-1 font-mono text-xs uppercase text-ink">
                            {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                    </div>
                    <p className="mt-3 font-body text-lg text-ink">{formatNaira(order.total)}</p>
                </div>
            ))}
        </div>
    );
}
