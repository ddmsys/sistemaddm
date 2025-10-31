"use client";

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (v: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={value.start.toISOString().slice(0, 10)}
        onChange={(e) => onChange({ start: new Date(e.target.value), end: value.end })}
        className="rounded border px-2 py-1 text-sm"
        aria-label="De"
      />
      <span>-</span>
      <input
        type="date"
        value={value.end.toISOString().slice(0, 10)}
        onChange={(e) => onChange({ start: value.start, end: new Date(e.target.value) })}
        className="rounded border px-2 py-1 text-sm"
        aria-label="Até"
      />
    </div>
  );
}
