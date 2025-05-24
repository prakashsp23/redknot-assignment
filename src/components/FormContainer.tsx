import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormProgress } from "@/components/FormProgress";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface FormContainerProps {
  children: ReactNode;
  title: string;
  description: string;
  currentStep: number;
}

export function FormContainer({
  children,
  title,
  description,
  currentStep,
}: FormContainerProps) {
  return (
    <div className="container max-w-2xl mx-auto py-4 px-4 md:px-0 min-h-screen flex flex-col justify-center items-center">
      <Card className="w-full shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="space-y-3 pb-2">
          <div className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              {description}
            </CardDescription>
          </div>
          <Separator className="my-4" />
          <FormProgress currentStep={currentStep} totalSteps={3} />
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}