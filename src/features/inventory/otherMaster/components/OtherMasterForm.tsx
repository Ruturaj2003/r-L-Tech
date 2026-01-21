import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useOtherMasterMutation } from "../hooks/useOtherMasterMutations";
import {
  OtherMasterFormSchema,
  type OtherMasterFormData,
  type SaveOtherMaster,
} from "../schemas";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const OtherMasterForm = () => {
  const FORM_FIELDS = [
    {
      name: "masterType",
      label: "Master Type",
      type: "input",
      required: true,
    },
    {
      name: "masterName",
      label: "Master Name",
      type: "input",
      required: true,
    },
    {
      name: "lockStatus",
      label: "Lock Status",
      type: "select",
      required: true,
      options: [
        { label: "No", value: "N" },
        { label: "Yes", value: "Y" },
      ],
    },
    {
      name: "deleteReason",
      label: "Delete Reason",
      type: "textarea",
      required: false,
    },
  ] as const;

  const { saveMutation } = useOtherMasterMutation(1);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(OtherMasterFormSchema),
    defaultValues: {
      masterType: "",
      masterName: "",
      lockStatus: "N",
      deleteReason: "",
    },
  });

  const onSubmit = async (data: OtherMasterFormData) => {
    const payload: SaveOtherMaster = {
      ...data,
      status: "Insert",
      createdBy: 1,
      createdOn: new Date().toISOString(),
      mTransNo: 0,
      mCount: 0,
      systemIP: "0.0.0.0",
      subscID: 1,
    };

    try {
      await saveMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to save master:", error);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Other Master</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {FORM_FIELDS.map((field) => {
            const error = errors[field.name];

            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && (
                    <span className="text-muted-foreground"> *</span>
                  )}
                </Label>

                {field.type === "input" && (
                  <Input
                    id={field.name}
                    {...register(field.name)}
                    aria-invalid={!!error}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.name}
                    {...register(field.name)}
                    aria-invalid={!!error}
                  />
                )}

                {field.type === "select" && (
                  <Select
                    defaultValue="N"
                    onValueChange={(value) =>
                      setValue(field.name, value as "Y" | "N", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger aria-invalid={!!error}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Master"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
