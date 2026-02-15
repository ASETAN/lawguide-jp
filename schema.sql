-- Releases (e-Gov)
CREATE TABLE IF NOT EXISTS releases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    law_id TEXT,
    category TEXT,
    enforcement_date TEXT,
    publication_date TEXT,
    summary TEXT,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kanpou (Official Gazette)
CREATE TABLE IF NOT EXISTS kanpou (
    id TEXT PRIMARY KEY,
    date TEXT,
    title TEXT,
    type TEXT,
    source TEXT,
    pages TEXT,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Alerts (Combined View for notifications - optional or just query releases/kanpou)
-- For this app, we query tables directly.

-- Impact Analysis Records
CREATE TABLE IF NOT EXISTS impact_analysis (
    id TEXT PRIMARY KEY,
    law_id TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved
    risk_level TEXT,
    affected_departments TEXT,
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
