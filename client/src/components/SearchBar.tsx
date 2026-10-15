interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

/** Controlled search field. Debouncing is the caller's job so this stays presentational. */
export function SearchBar({ value, onChange, placeholder = '搜尋片名…', label = '搜尋電影' }: Props) {
  return (
    <div className="search">
      <svg className="search__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>

      <input
        className="search__input"
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />

      {value && (
        <button type="button" className="search__clear" onClick={() => onChange('')} aria-label="清除搜尋">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
