import type { Component } from 'vue';

export interface InputProps {
  label: string
  modelValue: string
  icon?: Component | string
  name: string
  customClasses?: string
  type?: string
  disableAutocomplete?: boolean
  isSubmitting?: boolean
}
