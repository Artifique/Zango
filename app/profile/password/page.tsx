"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../views/layout/app-shell";
import { supabase } from "../../../lib/supabase";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-syne font-bold text-white">Changer mon mot de passe</h2>
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Nouveau mot de passe</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg border border-white/10"
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Confirmer le nouveau mot de passe</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg border border-white/10"
              required 
            />
          </div>
          
          {error && <p className="text-danger text-sm">{error}</p>}
          {message && <p className="text-teal text-sm">{message}</p>}
          
          <button type="submit" className="w-full bg-teal text-charcoal font-bold p-3 rounded-lg hover:bg-teal-hover">
            Mettre à jour
          </button>
        </form>
      </div>
    </AppShell>
  );
}
