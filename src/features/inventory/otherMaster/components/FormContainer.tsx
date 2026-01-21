import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormContainerProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormContainer = ({
  title,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  children,
  className = "max-w-xl",
}: FormContainerProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div onSubmit={onSubmit}>
        <CardContent className="space-y-6">{children}</CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
