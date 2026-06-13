import { z } from "zod";

export const FieldTypeSchema = z.enum([
  "text",         // Short Text
  "textarea",     // Long Text
  "email",        // Email
  "number",       // Number
  "select",       // Single Select
  "multiselect",  // Multi Select
  "checkbox",     // Checkbox
  "rating",       // Rating
  "date"          // Date
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FormFieldSchema = z.object({
  id: z.string(),
  type: FieldTypeSchema,
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // for select, multiselect
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    errorMessage: z.string().optional()
  }).optional()
});

export type FormField = z.infer<typeof FormFieldSchema>;

export const FormSchemaJSON = z.object({
  fields: z.array(FormFieldSchema)
});

export type FormSchemaType = z.infer<typeof FormSchemaJSON>;

export const VisibilitySchema = z.enum(["draft", "public", "unlisted"]);
export type Visibility = z.infer<typeof VisibilitySchema>;

export const ThemeSchema = z.object({
  name: z.string(),
  primaryColor: z.string(),       // e.g. "#3b82f6"
  backgroundColor: z.string(),    // e.g. "#f3f4f6"
  textColor: z.string(),          // e.g. "#1f2937"
  cardColor: z.string().default("#ffffff"),
  fontFamily: z.string().default("Inter"),
  borderRadius: z.string().default("0.5rem")
});

export type Theme = z.infer<typeof ThemeSchema>;

// API Routers payload schemas
export const CreateFormInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(3).optional()
});

export const UpdateFormInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(3).optional(),
  schemaJson: FormSchemaJSON.optional(),
  themeJson: ThemeSchema.optional(),
  isPublished: z.boolean().optional(),
  visibility: VisibilitySchema.optional()
});

export const SubmitResponseInput = z.object({
  formId: z.string().uuid(),
  answersJson: z.record(z.any())
});

export const AIFormGenInput = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters")
});

export const AIThemeGenInput = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters")
});

export const AIInsightsInput = z.object({
  formId: z.string().uuid()
});

// Build a runtime Zod validator based on a Form's schema
export function buildSubmissionValidator(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "text":
      case "textarea":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(""));
        }
        break;

      case "email":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).email("Invalid email format").min(1, `${field.label} is required`);
        } else {
          fieldSchema = z.union([
            z.literal(""),
            z.string().email("Invalid email format").optional()
          ]);
        }
        break;

      case "number":
        // Submissions can come as string, we can preprocess
        fieldSchema = z.preprocess((val) => {
          if (val === "" || val === undefined || val === null) return undefined;
          const num = Number(val);
          return isNaN(num) ? val : num;
        }, z.number({ invalid_type_error: `${field.label} must be a number` }));

        if (field.required) {
          fieldSchema = fieldSchema;
        } else {
          fieldSchema = fieldSchema.optional();
        }

        if (field.validation) {
          if (field.validation.min !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).min(field.validation.min, `${field.label} must be at least ${field.validation.min}`);
          }
          if (field.validation.max !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).max(field.validation.max, `${field.label} must be at most ${field.validation.max}`);
          }
        }
        break;

      case "select":
        fieldSchema = z.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = z.string().refine((val) => field.options!.includes(val), {
            message: `Value must be one of: ${field.options.join(", ")}`
          });
        }
        if (field.required) {
          fieldSchema = fieldSchema;
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(""));
        }
        break;

      case "multiselect":
        fieldSchema = z.array(z.string());
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(1, `Please select at least one option`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "checkbox":
        fieldSchema = z.boolean();
        if (field.required) {
          fieldSchema = z.literal(true, {
            errorMap: () => ({ message: `${field.label} must be checked` })
          });
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "rating":
        fieldSchema = z.preprocess((val) => {
          if (val === "" || val === undefined || val === null) return undefined;
          return Number(val);
        }, z.number({ invalid_type_error: `${field.label} rating must be a number` }));

        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(1, `Rating is required`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "date":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} date is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(""));
        }
        break;

      default:
        fieldSchema = z.any();
    }

    shape[field.id] = fieldSchema;
  }

  return z.object(shape);
}
