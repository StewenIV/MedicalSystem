import { TriangleAlert, ClipboardCheck, PillBottle} from 'lucide-react'

export const Icon = {
  Bed: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 11V3"/><path d="M21 11V3"/>
      <path d="M3 7h6a2 2 0 0 1 2 2v2H3V7Z"/>
      <path d="M21 7h-6a2 2 0 0 0-2 2v2h8V7Z"/>
      <path d="M1 11h22v4H1z"/><path d="M3 15v4"/><path d="M21 15v4"/>
    </svg>
  ),
  BedDouble: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 4v16"/><path d="M22 4v16"/>
      <path d="M2 8h20"/><path d="M2 12h20"/>
      <rect x="2" y="4" width="9" height="8" rx="1"/>
      <rect x="13" y="4" width="9" height="8" rx="1"/>
      <path d="M2 16h20"/>
    </svg>
  ),
  BedSingle: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 11V3"/><path d="M21 11V3"/>
      <path d="M3 7h18v4H3V7Z"/>
      <path d="M1 11h22v4H1z"/><path d="M3 15v4"/><path d="M21 15v4"/>
    </svg>
  ),
  Hospital: () => (
    <svg width="32" height="32" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/>
      <path d="M12 7v6m-3-3h6"/>
    </svg>
  ),
  Alert: ({ size = 14, color }: { size?: number; color?: string }) => (
    <TriangleAlert width={size} height={size} color={color || 'currentColor'} />
  ),
  Check: ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Users: () => (
    <svg width="40" height="40" fill="none" stroke="#171717" strokeWidth="1.5" viewBox="0 0 24 24" style={{backgroundColor: '#d8e5ff', borderRadius: '8px', padding: 7}}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Pill: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
    </svg>
  ),
  FillBox: () => (
    <PillBottle width="12" height="12" color="currentColor" />
  ),
  Log: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  BedIcon: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M3 11V3"/><path d="M21 11V3"/>
      <path d="M3 7h6a2 2 0 0 1 2 2v2H3V7Z"/>
      <path d="M21 7h-6a2 2 0 0 0-2 2v2h8V7Z"/>
      <path d="M1 11h22v4H1z"/>
      <path d="M3 15v4"/><path d="M21 15v4"/>
    </svg>
  ),
  ClipBoard: ({color, size, style}: {color?: string; size?: number; style?: React.CSSProperties}) => (
    <ClipboardCheck width={size || 12} height={size || 12} color={color || 'currentColor'} style={style} />
  ),
}