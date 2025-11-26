export interface PotData {
  id: string
  name: string
  targetAmount: number
  totalAmount: number
  userId: string
  theme: ThemeData
  createdAt: string
}

export interface ThemeData {
  id: string
  colorName: string
  colorHex: string
}
