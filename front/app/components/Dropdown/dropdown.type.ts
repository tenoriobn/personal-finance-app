export interface DropdownOption {
  id?: string
  name: string
  label?: string
}

export interface DropdownProps {
  label: string
  options: (string | DropdownOption)[]
  modelValue: string | undefined
  customClasses?: string
  iconMobile?: Component | string
  dataTestid?: string
  compactOnMobile?: boolean
}
