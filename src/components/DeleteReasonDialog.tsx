import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/form/FormField";
import { ControlledSelect } from "@/components/form/ControlledInputs";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

interface DeleteReasonDialogProps<TForm extends FieldValues, TOption> {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** react-hook-form control */
  control: Control<TForm>;

  /** react-hook-form errors */
  errors: FieldErrors<TForm>;

  /** Name of the delete reason field (e.g. "deleteReason") */
  name: Path<TForm>;

  /** Options list */
  options: TOption[];

  /** How to get label from option */
  getLabel: (option: TOption) => string;

  /** How to get value from option */
  getValue: (option: TOption) => string;

  isSubmitting: boolean;

  /** Called when user confirms delete */
  onConfirm: () => void;

  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function DeleteReasonDialog<TForm extends FieldValues, TOption>({
  open,
  onOpenChange,
  control,
  errors,
  name,
  options,
  getLabel,
  getValue,
  isSubmitting,
  onConfirm,
  title = "Confirm Delete",
  description = "This action is irreversible. Please select a reason.",
  confirmLabel = "Confirm Delete",
}: DeleteReasonDialogProps<TForm, TOption>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <FormField
          label="Delete Reason"
          name={name}
          required
          error={errors[name]?.message as string | undefined}
        >
          <ControlledSelect
            name={name}
            control={control}
            options={options.map((opt) => ({
              label: getLabel(opt),
              value: getValue(opt),
            }))}
          />
        </FormField>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
