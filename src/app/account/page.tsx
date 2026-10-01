"use client";

import { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Accounts</h1>
        <p className="mt-4 text-gray-600">
          Sign-in is powered by Firebase Authentication. Add your Firebase config to <code className="rounded bg-violet-100 px-1">.env.local</code> (see
          <code className="rounded bg-violet-100 px-1">.env.example</code>) and enable Email/Password and Google providers in the Firebase console.
        </p>
      </div>
    );
  }

  if (loading) return <div className="min-h-[60vh]" />;

  const auth = getFirebaseAuth()!;

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace("Firebase: ", "") : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-6xl">🐾</p>
        <h1 className="mt-4 text-3xl font-extrabold">Hi {user.displayName || user.email}!</h1>
        <p className="mt-2 text-gray-500">Your orders will be linked to this account at checkout.</p>
        <button type="button" onClick={() => run(() => signOut(auth))} className="mt-8 rounded-full border border-violet-200 px-6 py-3 font-semibold text-violet-700 hover:bg-violet-50">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              if (mode === "signin") {
                await signInWithEmailAndPassword(auth, email, password);
              } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                if (name) await updateProfile(cred.user, { displayName: name });
              }
            });
          }}
        >
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-violet-200 px-4 py-3 outline-none focus:border-violet-500" />
          )}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-violet-200 px-4 py-3 outline-none focus:border-violet-500" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-violet-200 px-4 py-3 outline-none focus:border-violet-500" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => signInWithPopup(auth, new GoogleAuthProvider()))}
          className="mt-3 w-full rounded-full border border-gray-200 py-3 font-semibold hover:bg-gray-50"
        >
          Continue with Google
        </button>
        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button type="button" className="font-semibold text-violet-700" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
