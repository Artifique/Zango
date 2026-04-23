"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useAuthController } from "../../controllers/auth-controller";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isBootstrapping } = useAuthController();
  const [username, setUsername] = useState("Alex Kapranos");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = login(username, password);
    if (!isValid) {
      setError("Identifiants requis.");
      return;
    }
    setError("");
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-teal/20">
        <h1 className="text-2xl font-syne font-extrabold mb-2">Connexion CryptoAgent</h1>
        <p className="text-white/40 text-sm font-mono mb-8">Accès sécurisé à la supervision des opérations.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2">Utilisateur</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className="glass-input w-full pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                className="glass-input w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error ? <p className="text-danger text-xs font-mono">{error}</p> : null}

          <button className="w-full py-3 rounded-xl bg-teal text-charcoal font-bold font-syne hover:bg-teal-hover transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
