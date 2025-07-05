const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';

export const Colors = {
  // 共通カラー
  primary: "#6849a7",      // メインアクセント色
  warning: "#cc475a",      // 警告やエラーカラー
  success: "#4CAF50",      // 成功状態の色
  info: "#2196F3",         // 情報表示の色

  light: {
    background: '#F2F3F5',
    navBackground: '#e8e7ef',
    text: '#11181C',

    tint: tintColorLight,
    iconColor: '#686477',
    iconColorFocused: '#201e2b',
    uiBackground: "#d6d5e1",

    success: '#4CAF50',
    warning: '#ff7043',
    error: '#f44336',
  },

  dark: {
    background: '#151718',
    navBackground: '#201e2b',
    text: '#ECEDEE',

    tint: tintColorDark,
    iconColor: '#9BA1A6',
    iconColorFocused: '#ffffff',
    uiBackground: "#2f2b3d",

    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    success: '#81C784',
    warning: '#ff8a65',
    error: '#e57373',
  },
};
