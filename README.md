# Form Builder Assessment

A Vue 3 + Vite project that showcases a dynamic form builder with reusable base form inputs, a visual builder, and a multi-step form wizard. The repository also includes a fully configured Storybook for interactive component documentation and testing.

### Live Production Link:
https://vue-dynamic-form-builder-storybook.netlify.app/

## Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite 7
- **Type Checking**: TypeScript + vue-tsc
- **Styling**: Tailwind CSS 4 (+ forms plugin)
- **Routing/State**: Vue Router 4, Pinia 3
- **Validation**: Vee-Validate 4, Yup 1
- **Date Picker**: vuejs3-datepicker
- **Icons**: @heroicons/vue
- **Testing**: Vitest + @vue/test-utils + jsdom
- **Docs**: Storybook 9 (vue3-vite)

## Features

- **Dynamic Form Builder (`FormBuilder.vue`)**
  - Add default and custom fields (text, number, select, dropdown, checkbox group, radio, date)
  - Validation and error handling (including date and checkbox constraints)
  - Undo/redo history, draft autosave, and draft restore
  - Visual custom field builder with option editor
- **Visual Form Builder (`VisualFormBuilder.vue`)**
  - Drag-and-drop field palette and canvas
  - Reorder, remove, and export schema
  - Live schema preview
- **Multi-Step Form Wizard (`MultiStepFormWizard.vue`)**w
  - Stepper UI with progress indicators
  - Per-step validation hook and final submit callback
  - Review step with model preview
- **Reusable Base Inputs**
  - `BaseTextField`, `BaseSelectField` (single/multi, async options, custom tags), `BaseDropdown`, `BaseCheckboxGroup`, `BaseDateField`
- **Storybook**
  - Interactive stories for all components, with fullscreen layout for the wizard
  - A11y and Docs addons enabled

## Prerequisites

- Node.js: ^20.19.0 or >=22.12.0 (see `package.json` engines)
- npm (recommended) or yarn/pnpm

## Installation

```bash
npm install
```

## Scripts

- **Dev app**: `npm run dev` – start Vite dev server
- **Type-check**: `npm run type-check` – run vue-tsc
- **Build**: `npm run build` – type-check + Vite build
- **Preview**: `npm run preview` – preview production build
- **Unit tests**: `npm run test:unit` – run Vitest
- **Storybook dev**: `npm run storybook` – start Storybook on port 6006
- **Storybook build**: `npm run build-storybook` – static build to `storybook-static/`

## Development

1. Start the app:
   ```bash
   npm run dev
   ```
2. Open the app at `http://localhost:5173` (or the port shown).
3. Type-check in a separate terminal (optional):
   ```bash
   npm run type-check -- --watch
   ```

## Project Structure (high-level)

```
src/
  components/
    base/                 # Reusable base inputs
    FormBuilder/          # Form builder, wizard, visual builder
    ToastProvider.vue     # App-wide toasts used in demos
  composables/            # toast, validation, form state helpers
  stories/                # Storybook stories for components
  assets/, router/, stores/, types/, utils/
.storybook/               # Storybook configuration
```

## Component Catalog (highlights)

- `components/base/BaseTextField.vue`
  - Props: `modelValue`, `label`, `placeholder`, `id`, `name`, `type`, `error`
  - Emits: `update:modelValue`
- `components/base/BaseSelectField.vue`
  - Single or multiple select; async option loading; custom tag creation
  - Props: `modelValue (string|string[])`, `options`, `label?`, `multiple?`, `asyncLoad?`, `placeholder?`, `allowCustom?`, `required?`, `id?`
  - Emits: `update:modelValue`
- `components/base/BaseDropdown.vue`
  - Simple dropdown with options
  - Props: `modelValue`, `options`, `placeholder?`, `required?`, `label`
  - Emits: `update:modelValue`
- `components/base/BaseCheckboxGroup.vue`
  - Checkbox list with min/max/required validation
  - Props: `modelValue (string[])`, `options`, `label?`, `required?`, `minSelected?`, `maxSelected?`
  - Emits: `update:modelValue`
- `components/base/BaseDateField.vue`
  - Datepicker with min/max/future-only, clearable control
  - Props: `modelValue (string|null)`, `label?`, `placeholder?`, `minDate?`, `maxDate?`, `futureOnly?`, `clearable?`
  - Emits: `update:modelValue`
- `components/FormBuilder/FormBuilder.vue`
  - Dynamic fields, custom builder, autosave, undo/redo, validation
- `components/FormBuilder/VisualFormBuilder.vue`
  - Drag, drop, reorder, export schema, live JSON preview
- `components/FormBuilder/MultiStepFormWizard.vue`
  - Step navigation, per-step validation, submit, review

## Using the Form Builder

- Default fields are defined in `FormBuilder.vue` and can be extended at runtime by adding custom fields via the builder section.
- For select-like components, supply `options: { label, value }[]`.
- Date fields accept `minDate`, `maxDate`, and `futureOnly` for constraints.

## Validation

- `useFormValidation.ts` validates required fields and constraints for date and checkbox group.
- Extend validation by modifying the `schema` map in `FormBuilder.vue`.

## State, Undo/Redo, Drafts

- `useFormState.ts` powers undo/redo and autosave to `localStorage`.
- Call `saveDraft()` to persist, `loadDraft()` to recover.

## Storybook

Storybook is set up for Vue 3 with Vite, including a11y and docs.

### Install and Run

```bash
npm run storybook
```

- Opens at `http://localhost:6006`.
- Static build:
  ```bash
  npm run build-storybook
  ```
  Output in `storybook-static/`.

### Configuration

- `.storybook/main.ts` – framework `@storybook/vue3-vite`, stories glob, addons (`@storybook/addon-a11y`, `@storybook/addon-docs`), and a custom builder vite config.
- `.storybook/preview.ts` – global parameters (`layout: 'centered'` by default) and a `ToastProvider` decorator. Individual stories override layout (e.g., `MultiStepFormWizard` uses `layout: 'fullscreen'`).
- `.storybook/vite.config.ts` – Vite plugins and `@` alias to `src/`.

### Writing Stories

- Place stories next to components under `src/**` with `*.stories.ts` or `*.stories.js`.
- Example (excerpt):

  ```ts
  import { Meta, StoryObj } from "@storybook/vue3";
  import Component from "../components/FormBuilder/MultiStepFormWizard.vue";

  const meta: Meta<typeof Component> = {
    title: "Example/MultiStepFormWizard",
    component: Component,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
  };
  export default meta;
  ```

### Addons

- Accessibility checks via `@storybook/addon-a11y` (enabled globally)
- Auto-generated Docs via `@storybook/addon-docs`

## Testing

Run unit tests:

```bash
npm run test:unit
```

- Vitest is configured in `vitest.config.ts` with jsdom and Vue Test Utils.

## Build & Preview

- Build app: `npm run build`
- Preview app: `npm run preview`
- Build Storybook: `npm run build-storybook`

## Troubleshooting

- Ensure Node version matches `engines` in `package.json`.
- If Tailwind styles don’t load in Storybook, check the import in `.storybook/preview.ts` (`../src/tailwind.css`).
- If aliases don’t resolve in Storybook, verify `.storybook/vite.config.ts` alias `@ -> src`.
- Type errors: run `npm run type-check` and fix reported issues.

## License

MIT
