import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/lib/data";

export interface UserProfile {
  name: string;
  email: string;
  major: string;
  year: string;
  careerGoals: string;
  careerTrack: string;
  skills: string[];
  needsSponsorship: boolean;
  resumeFilename: string;
  locationPreference: string;
  remotePreference: string;
}

interface SessionState {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  chatMessages: ChatMessage[];
}

interface SessionContextValue extends SessionState {
  login: (profile: UserProfile) => void;
  logout: () => void;
  setChatMessages: (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  clearChat: () => void;
}

const defaultState: SessionState = {
  isLoggedIn: false,
  userProfile: null,
  chatMessages: [],
};

const SessionContext = createContext<SessionContextValue>({
  ...defaultState,
  login: () => {},
  logout: () => {},
  setChatMessages: () => {},
  clearChat: () => {},
});

function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem("nole-session");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return defaultState;
}

function saveSession(state: SessionState) {
  try {
    localStorage.setItem("nole-session", JSON.stringify(state));
  } catch {}
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(loadSession);

  useEffect(() => {
    saveSession(state);
  }, [state]);

  const login = useCallback((profile: UserProfile) => {
    setState({ isLoggedIn: true, userProfile: profile, chatMessages: [] });
  }, []);

  const logout = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem("nole-session");
  }, []);

  const setChatMessages = useCallback(
    (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setState((prev) => ({
        ...prev,
        chatMessages: typeof msgs === "function" ? msgs(prev.chatMessages) : msgs,
      }));
    },
    []
  );

  const clearChat = useCallback(() => {
    setState((prev) => ({ ...prev, chatMessages: [] }));
  }, []);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        login,
        logout,
        setChatMessages,
        clearChat,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
