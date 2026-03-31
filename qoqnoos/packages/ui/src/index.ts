export const colors = {
  phoenix: {
    gold: '#C6963A',
    deep: '#1A1040',
    purple: '#2D1B5E',
    warm: '#FDF6E3',
    ember: '#E8752A',
    rose: '#D4547A',
  },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const fonts = { vazir: 'Vazirmatn', nastaliq: 'IranNastaliq' } as const;
export type PhoenixColor = keyof typeof colors.phoenix;
