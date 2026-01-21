import * as React from "react";
import {
  useForm,
  type DefaultValues,
  type UseFormReturn,
  type SubmitHandler,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

/* ---------------------------------- */
/* Types                               */
/* ---------------------------------- */

type CrudMode = "create" | "update" | "delete" | "view";

type BaseFormProps<TForm extends FieldValues> = {
  schema: ZodSchema<TForm>;
  defaultValues: DefaultValues<TForm>;
  children: (form: UseFormReturn<TForm>) => React.ReactNode;
};

type CreateUpdateProps<TForm extends FieldValues> = BaseFormProps<TForm> & {
  mode: "create" | "update";
  onSave: (data: TForm) => Promise<void>;
};

type DeleteProps<TForm extends FieldValues> = BaseFormProps<TForm> & {
  mode: "delete";
  onDelete: (data: TForm) => Promise<void>;
};

type ViewProps<TForm extends FieldValues> = BaseFormProps<TForm> & {
  mode: "view";
};

type CrudFormProps<TForm extends FieldValues> =
  | CreateUpdateProps<TForm>
  | DeleteProps<TForm>
  | ViewProps<TForm>;

/* ---------------------------------- */
/* Component                           */
/* ---------------------------------- */

export function CommonForm<TForm extends FieldValues>(
  props: CrudFormProps<TForm>,
) {
  const form = useForm<TForm>({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultValues,
  });

  const onSubmit: SubmitHandler<TForm> = async (data) => {
    switch (props.mode) {
      case "create":
      case "update":
        await props.onSave(data);
        return;

      case "delete":
        await props.onDelete(data);
        return;

      case "view":
        return;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{props.children(form)}</form>
  );
}
