import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const steps = [
    { label: "Personal Info", description: "Your contact details" },
    { label: "Education", description: "Your academic background" },
    { label: "Projects", description: "Your work experience" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = currentStep === index + 1;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 relative",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
          );
        })}
      </div>

      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "text-sm transition-colors duration-200",
              index + 1 === currentStep
                ? "text-primary font-medium"
                : index + 1 < currentStep
                  ? "text-primary/80"
                  : "text-muted-foreground"
            )}
          >
            <div className="font-medium">{step.label}</div>
            <div className="text-xs mt-0.5">{step.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}