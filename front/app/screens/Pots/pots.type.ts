export interface PotData {
  id: string
  name: string
  targetAmount: number
  totalAmount: number
  theme: ThemeData
  createdAt: string
}

export interface ThemeData {
  id: string
  colorName: string
  colorHex: string
}

export interface PotForm {
  name: string
  targetAmount: number
  totalAmount: number
  themeId: string
}

export interface PotsCache {
  result: PotData[]
}

export interface ThemesCache {
  result: ThemeData[]
}
