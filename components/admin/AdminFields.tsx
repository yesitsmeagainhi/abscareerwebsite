// Plain presentational form fields for the admin (server components — no state).

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export function TextInput({
  name,
  label,
  defaultValue,
  required,
  placeholder,
  hint,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <span className="block text-xs text-gray-400">{hint}</span>}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
    </label>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  rows = 3,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {hint && <span className="block text-xs text-gray-400">{hint}</span>}
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={inputCls} />
    </label>
  );
}

/** Textarea where each non-empty line becomes one list item. */
export function ListField({
  name,
  label,
  defaultValue = [],
  rows = 4,
  hint = "One item per line.",
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  rows?: number;
  hint?: string;
}) {
  return (
    <TextArea name={name} label={label} defaultValue={defaultValue.join("\n")} rows={rows} hint={hint} />
  );
}
