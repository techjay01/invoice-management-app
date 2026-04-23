// ─── Icons ────────────────────────────────────────────────────────────────────

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 28 26" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M 14 13 L 18.59 3.55 A 12 12 0 1 1 9.41 3.55 Z" fill="white"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9.994 12.556a2.56 2.56 0 1 0 0-5.12 2.56 2.56 0 0 0 0 5.12Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.994 0a.641.641 0 0 1 .641.641V2.56a.641.641 0 1 1-1.282 0V.641A.641.641 0 0 1 9.994 0Zm0 17.435a.641.641 0 0 1 .641.641v1.283a.641.641 0 1 1-1.282 0v-1.283a.641.641 0 0 1 .641-.641ZM2.83 2.83a.641.641 0 0 1 .906 0l.908.907a.641.641 0 1 1-.906.906l-.908-.907a.641.641 0 0 1 0-.906Zm13.532 13.532a.641.641 0 0 1 .907 0l.907.907a.641.641 0 0 1-.906.906l-.908-.907a.641.641 0 0 1 0-.906ZM0 9.994A.641.641 0 0 1 .64 9.353h1.923a.641.641 0 1 1 0 1.282H.641A.641.641 0 0 1 0 9.994Zm17.435 0a.641.641 0 0 1 .641-.641h1.283a.641.641 0 1 1 0 1.282h-1.283a.641.641 0 0 1-.641-.641ZM3.736 16.362a.641.641 0 0 1 0-.907l.908-.907a.641.641 0 1 1 .906.906l-.907.908a.641.641 0 0 1-.907 0ZM16.271 2.83a.641.641 0 0 1 .907-.001l.906.907a.641.641 0 0 1-.906.906l-.907-.907a.641.641 0 0 1 0-.905Z" fill="currentColor"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.567 0a9.076 9.076 0 0 0 0 18.151A9.077 9.077 0 0 0 17.644 9.08 9.076 9.076 0 0 1 8.567 0Z" fill="currentColor"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
    <path d="M1 1L5.228 5.228L9.455 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
    <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="20" viewBox="0 0 13 16" fill="none">
    <path d="M11.583 3H8.5V2.25A2.25 2.25 0 0 0 6.25 0h-.5A2.25 2.25 0 0 0 3.5 2.25V3H.417A.417.417 0 1 0 .417 3.833H1.25V13.25A2.75 2.75 0 0 0 4 16H8a2.75 2.75 0 0 0 2.75-2.75V3.833h.833A.417.417 0 1 0 11.583 3ZM4.333 2.25A1.417 1.417 0 0 1 5.75.833h.5A1.417 1.417 0 0 1 7.667 2.25V3H4.333V2.25Zm5.584 11A1.917 1.917 0 0 1 8 15.167H4A1.917 1.917 0 0 1 2.083 13.25V3.833H9.917V13.25Z" fill="currentColor"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M6.313 10.023V6.313h3.71V4.823h-3.71V1.113H4.823v3.71H1.113v1.49h3.71v3.71h1.49Z" fill="currentColor"/>
  </svg>
);

const CheckMark = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
    <path d="M1 4.304L3.696 7l5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export { Logo, SunIcon, MoonIcon, ChevronDown, ChevronRight, TrashIcon, PlusIcon, CheckMark };