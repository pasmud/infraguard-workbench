import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Finding, Exception, ScannerConfig } from '../api/client';

interface AppState {
  findings: Finding[];
  exceptions: Exception[];
  config: ScannerConfig | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_FINDINGS'; payload: Finding[] }
  | { type: 'SET_EXCEPTIONS'; payload: Exception[] }
  | { type: 'SET_CONFIG'; payload: ScannerConfig }
  | { type: 'ADD_FINDINGS'; payload: Finding[] }
  | { type: 'ADD_EXCEPTION'; payload: Exception }
  | { type: 'UPDATE_EXCEPTION'; payload: Exception }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  findings: [],
  exceptions: [],
  config: null,
  loading: false,
  error: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FINDINGS':
      return { ...state, findings: action.payload };
    case 'SET_EXCEPTIONS':
      return { ...state, exceptions: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'ADD_FINDINGS':
      return { ...state, findings: [...action.payload, ...state.findings] };
    case 'ADD_EXCEPTION':
      return { ...state, exceptions: [...state.exceptions, action.payload] };
    case 'UPDATE_EXCEPTION':
      return {
        ...state,
        exceptions: state.exceptions.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
