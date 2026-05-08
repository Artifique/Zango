"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuthController } from "../../controllers/auth-controller";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthController();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Déclenchement du login pour:", email);
    const { data, error } = await login(email, password);
    if (error) {
      console.error("Erreur de connexion:", error.message);
      setError(error.message);
      return;
    }
    console.log("Connexion réussie, session:", data);
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-teal/20">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-syne font-extrabold mb-2 text-center">Connexion alyce</h1>
        <p className="text-white/40 text-sm font-mono mb-8 text-center">Accès sécurisé à la plateforme.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2">Email</label>
            <div className="relative" suppressHydrationWarning={true}>
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                className="glass-input w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2">Mot de passe</label>
            <div className="relative" suppressHydrationWarning={true}>
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                className="glass-input w-full pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-danger text-xs font-mono">{error}</p> : null}

          <button type="submit" className="w-full py-3 rounded-xl bg-teal text-charcoal font-bold font-syne hover:bg-teal-hover transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
