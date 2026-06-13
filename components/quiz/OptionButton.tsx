"use client";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({
  label,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/10 text-text-primary"
          : "border-border-custom bg-surface text-text-muted hover:border-primary/50 hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}
