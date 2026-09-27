import { WallpaperPreset } from '../types/word';

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'clean-minimal',
    name: '纯净极简',
    type: 'color',
    value: '#f8fafc',
    darkOverlay: false,
  },
  {
    id: 'deep-slate',
    name: '深邃夜空',
    type: 'color',
    value: '#0f172a',
    darkOverlay: true,
  },
  {
    id: 'morandi-blue',
    name: '莫兰迪青',
    type: 'gradient',
    value: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #eff6ff 100%)',
    darkOverlay: false,
  },
  {
    id: 'sunset-glow',
    name: '晨曦暖橘',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fef3c7 0%, #fee2e2 50%, #ffedd5 100%)',
    darkOverlay: false,
  },
  {
    id: 'lavender-mist',
    name: '紫雾星尘',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 50%, #fdf4ff 100%)',
    darkOverlay: false,
  },
  {
    id: 'sage-green',
    name: '初春竹影',
    type: 'gradient',
    value: 'linear-gradient(135deg, #dcfce7 0%, #e0f2fe 50%, #f0fdf4 100%)',
    darkOverlay: false,
  },
  {
    id: 'cyber-dark',
    name: '极客暗夜',
    type: 'gradient',
    value: 'linear-gradient(135deg, #18181b 0%, #09090b 50%, #1e1b4b 100%)',
    darkOverlay: true,
  }
];
