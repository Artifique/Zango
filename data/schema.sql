-- Extension pour UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Table des Agents
CREATE TABLE agents (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'AGENT'
    CHECK (role IN ('DIRECTEUR', 'AGENT_PRINCIPAL', 'AGENT')),
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies pour clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectés peuvent lire les clients" ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs connectés peuvent ajouter des clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Table des Taux
CREATE TABLE rates (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL, -- USDT, BTC, etc.
  valeur NUMERIC(10,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des Transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref TEXT UNIQUE NOT NULL,
  montant NUMERIC(15,2) NOT NULL,
  taux NUMERIC(10,2) NOT NULL,
  usd_value NUMERIC(15,2) NOT NULL,

  client_id TEXT REFERENCES clients(id),
  agent_id UUID REFERENCES agents(id),

  statut TEXT DEFAULT 'EN_ATTENTE'
    CHECK (
      statut IN (
        'EN_ATTENTE',
        'EN_CONFIRMATION',
        'VALIDE',
        'ENVOYE',
        'ANNULE'
      )
    ),

  date_transaction TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table des Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  agent_id UUID REFERENCES agents(id),
  tx_id UUID REFERENCES transactions(id),

  message TEXT NOT NULL,

  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- RLS (Row Level Security)
-- =========================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Les agents voient leurs transactions
CREATE POLICY "Agents voient leurs transactions"
ON transactions
FOR SELECT
USING (auth.uid() = agent_id);

-- Les directeurs peuvent tout faire
CREATE POLICY "Directeurs peuvent tout voir"
ON transactions
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM agents
    WHERE agents.id = auth.uid()
      AND agents.role = 'DIRECTEUR'
  )
);

-- =========================
-- Initialisation Admin
-- =========================

-- INSERT INTO agents (id, nom, email, role)
-- VALUES (
--   'UUID_UTILISATEUR',
--   'Administrateur',
--   'fombadaouda72@gmail.com',
--   'DIRECTEUR'
-- );