import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole =
  | 'CEO'
  | 'PROJECT_MANAGER'
  | 'CONTENT_EDITOR'
  | 'FINANCIAL_OFFICER'
  | 'ACCOUNTANT'
  | 'SECRETARY';

interface User {
  role: AdminRole;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  recipient: string;
  type: 'Critical' | 'Warning' | 'Info';
  metadata?: any;
}

export interface ThreatLog {
  id: string;
  timestamp: string;
  attemptedKey: string;
  location: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  resolution: string;
  networkProvider: string;
  status: 'Flagged' | 'Trace Active' | 'Clear-Neutralized' | 'Blocked';
  riskLevel: 'Low' | 'Medium' | 'Critical';
  type: 'Login' | 'MFA' | 'Key Change';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    commandKey: string
  ) => Promise<{ success: boolean; mfaRequired?: boolean; error?: string }>;
  verifyMfa: (code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;

  getKeys: () => Record<AdminRole, string>;
  updateKey: (role: AdminRole, newKey: string) => void;
  revokeKey: (role: AdminRole) => void;
  rotateAllKeys: () => Promise<void>;
  generateComplexKey: (role: AdminRole) => string;

  getThreatLogs: () => ThreatLog[];
  getSecurityAlerts: () => SecurityAlert[];

  clearThreatLogs: () => void;
  updateThreatLogStatus: (
    id: string,
    status: ThreatLog['status']
  ) => void;

  getLockoutStatus: () => { isLocked: boolean; remaining: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCKOUT_LIMIT = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [keys, setKeys] = useState<Record<AdminRole, string>>({} as Record<
    AdminRole,
    string
  >);

  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  const [mfaCode, setMfaCode] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<AdminRole | null>(null);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // ---------------- INIT ----------------
  useEffect(() => {
    try {
      const session = localStorage.getItem('madecc_admin_session');
      const role = localStorage.getItem('madecc_admin_role') as AdminRole;

      const logs = localStorage.getItem('madecc_threat_logs');
      const alerts = localStorage.getItem('madecc_security_alerts');
      const lockout = localStorage.getItem('madecc_lockout');

      if (logs) setThreatLogs(JSON.parse(logs));
      if (alerts) setSecurityAlerts(JSON.parse(alerts));
      if (lockout) {
        const time = Number(lockout);
        if (time > Date.now()) setLockoutUntil(time);
      }

      if (session === 'active' && role) {
        setIsAuthenticated(true);
        setUser({ role });

        if (role === 'CEO') {
          fetch('/api/admin/keys')
            .then(r => r.json())
            .then(setKeys)
            .catch(console.error);
        }
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------------- LOCKOUT ----------------
  const getLockoutStatus = () => {
    if (!lockoutUntil) return { isLocked: false, remaining: 0 };

    const remaining = lockoutUntil - Date.now();
    if (remaining <= 0) return { isLocked: false, remaining: 0 };

    return { isLocked: true, remaining: Math.ceil(remaining / 1000) };
  };

  // ---------------- SECURITY ALERT ----------------
  const sendSecurityAlert = (
    title: string,
    message: string,
    type: SecurityAlert['type'],
    metadata?: any
  ) => {
    const alert: SecurityAlert = {
      id: `ALT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      title,
      message,
      recipient: 'madeccco5@gmail.com',
      type,
      metadata
    };

    setSecurityAlerts(prev => {
      const updated = [alert, ...prev].slice(0, 50);
      localStorage.setItem('madecc_security_alerts', JSON.stringify(updated));
      return updated;
    });
  };

  // ---------------- KEY GENERATION ----------------
  const generateComplexKey = (role: AdminRole): string => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    const array = new Uint32Array(16);
    crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < array.length; i++) {
      result += charset[array[i] % charset.length];
    }

    return `${role.slice(0, 3).toUpperCase()}_SECURE_${result}_${new Date().getFullYear()}`;
  };

  // ---------------- LOGIN ----------------
  const login = async (commandKey: string) => {
    const lock = getLockoutStatus();
    if (lock.isLocked) {
      return { success: false, error: `LOCKED: retry in ${lock.remaining}s` };
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandKey: commandKey.trim() })
      });

      if (!res.ok) throw new Error('Login failed');

      const { role } = await res.json();

      if (role === 'CEO') {
        const keyRes = await fetch('/api/admin/keys');
        setKeys(await keyRes.json());

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setMfaCode(code);
        setTempRole(role);

        await fetch('/api/send-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            email: 'madeccco5@gmail.com',
            role
          })
        });

        return { success: true, mfaRequired: true };
      }

      setIsAuthenticated(true);
      setUser({ role });
      localStorage.setItem('madecc_admin_session', 'active');
      localStorage.setItem('madecc_admin_role', role);

      return { success: true };
    } catch (err) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      if (attempts >= LOCKOUT_LIMIT) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(until);
        localStorage.setItem('madecc_lockout', String(until));

        sendSecurityAlert(
          'BRUTE FORCE DETECTED',
          'Multiple failed login attempts detected.',
          'Critical'
        );
      }

      return { success: false, error: 'INVALID COMMAND' };
    }
  };

  // ---------------- MFA ----------------
  const verifyMfa = async (code: string) => {
    if (code === mfaCode && tempRole) {
      setIsAuthenticated(true);
      setUser({ role: tempRole });

      localStorage.setItem('madecc_admin_session', 'active');
      localStorage.setItem('madecc_admin_role', tempRole);

      setMfaCode(null);
      setTempRole(null);
      return true;
    }

    sendSecurityAlert(
      'MFA FAILED',
      'Invalid MFA attempt detected.',
      'Warning'
    );

    return false;
  };

  // ---------------- KEY OPS ----------------
  const updateKey = async (role: AdminRole, newKey: string) => {
    await fetch('/api/admin/keys/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, newKey })
    });

    setKeys(prev => ({ ...prev, [role]: newKey }));
  };

  const revokeKey = async (role: AdminRole) => {
    await updateKey(role, `REVOKED_${Date.now()}`);
  };

  const rotateAllKeys = async () => {
    const res = await fetch('/api/admin/keys/rotate-all', {
      method: 'POST'
    });

    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        verifyMfa,
        logout,
        isLoading,
        getKeys: () => keys,
        updateKey,
        revokeKey,
        rotateAllKeys,
        generateComplexKey,
        getThreatLogs: () => threatLogs,
        getSecurityAlerts: () => securityAlerts,
        clearThreatLogs: () => setThreatLogs([]),
        updateThreatLogStatus: () => {},
        getLockoutStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}