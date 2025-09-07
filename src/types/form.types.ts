export type FieldType = "text" | "select" | "checkbox-group" | "date";

export interface SelectOption {
  label: string;
  value: string | number | boolean;
  group?: string;
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
  validator?: (value: any, formData: Record<string, any>) => boolean;
}

export interface ConditionalRule {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: any;
}

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ValidationRule[];
  conditionalDisplay?: ConditionalRule | ConditionalRule[];
  conditionalOperator?: "AND" | "OR";
  options?: SelectOption[];
  multiple?: boolean;
}

export interface FormSchema {
  id?: string;
  fields: FormField[];
}
