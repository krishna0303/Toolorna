import ProgressBar from "@/components/ui/ProgressBar";
import OptionButton from "./OptionButton";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onBack?: () => void;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedValue,
  onSelect,
  onBack,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className="mt-8">
        <p className="text-sm text-text-muted mb-2">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-2xl font-semibold mb-8">{question}</h2>

        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <OptionButton
              key={option}
              label={option}
              selected={selectedValue === option}
              onClick={() => onSelect(option)}
            />
          ))}
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
          >
            &larr; Back
          </button>
        )}
      </div>
    </div>
  );
}
