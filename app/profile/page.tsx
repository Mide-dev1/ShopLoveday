"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import AuthForm from "@/components/profile/AuthForm";
import OrdersTab from "@/components/profile/OrdersTab";
import ProfileTab from "@/components/profile/ProfileTab";

// Next.js requires any component that calls useSearchParams() to be
// wrapped in a <Suspense> boundary — without it, the build fails while
// trying to statically prerender this page (that was today's build error).
// So the default export below is just a thin wrapper; all the actual logic
// (including useSearchParams) lives in ProfilePageContent, rendered inside
// <Suspense>.
export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const { user, loading, signOut, updateProfile } = useAuth();
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectedFrom = searchParams.get("redirectedFrom");
    if (user && redirectedFrom) router.push(redirectedFrom);
  }, [user, searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <Navbar />
        <p className="px-6 py-8 font-body text-muted md:px-16">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <section className="px-6 py-8 md:px-16">
        {!user ? (
          <AuthForm />
        ) : (
          <div className="mx-auto max-w-lg">
            <h1 className="font-display text-3xl text-ink">My account</h1>

            <div className="mt-6 flex gap-2 rounded-full border border-line p-1">
              <button
                onClick={() => setTab("orders")}
                className={`flex-1 rounded-full py-2 font-body text-sm uppercase tracking-wide transition-colors ${tab === "orders" ? "bg-ink text-paper" : "text-muted"
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setTab("profile")}
                className={`flex-1 rounded-full py-2 font-body text-sm uppercase tracking-wide transition-colors ${tab === "profile" ? "bg-ink text-paper" : "text-muted"
                  }`}
              >
                Profile
              </button>
            </div>

            <div className="mt-8">
              {tab === "orders" ? (
                <OrdersTab userId={user.id} />
              ) : (
                <ProfileTab
                  userId={user.id}
                  email={user.email!}
                  fullName={user.user_metadata?.full_name ?? ""}
                  username={user.user_metadata?.username ?? ""}
                  phone={user.user_metadata?.phone ?? ""}
                  onUpdateAuth={updateProfile}
                  onSignOut={signOut}
                />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
