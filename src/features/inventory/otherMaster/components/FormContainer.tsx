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
  setModalClose?: () => void;
  mode: FORM_MODE;
}

import type { FORM_MODE } from "../types/otherMaster.types";
export const FormContainer = ({
  title,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  children,
  className = "max-w-xl",
  setModalClose,
  mode,
}: FormContainerProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div onSubmit={onSubmit}>
        <CardContent className="space-y-6">{children}</CardContent>
        <CardFooter className="flex justify-end mt-2">
          <div className="flex gap-x-2 justify-between">
            {setModalClose && (
              <Button onClick={setModalClose} variant={"outline"}>
                Close
              </Button>
            )}
            {mode !== "View" && (
              <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
