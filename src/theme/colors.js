// Paleta de cores para o tema da barbearia
export const colors = {
    // Cor primária da aplicação
    barber: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#b9e6fe",
      300: "#7cd3fd",
      400: "#36b9fa",
      500: "#0c9fe8",
      600: "#017fc6",
      700: "#0266a1",
      800: "#065885",
      900: "#0b4b6f",
      950: "#07304c",
    },
    
    // Cores para modo claro
    light: {
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      cardForeground: "240 10% 3.9%",
      popover: "0 0% 100%",
      popoverForeground: "240 10% 3.9%",
      primary: "195 90% 38%",
      primaryForeground: "0 0% 98%",
      secondary: "240 4.8% 95.9%",
      secondaryForeground: "240 5.9% 10%",
      muted: "240 4.8% 95.9%",
      mutedForeground: "240 3.8% 46.1%",
      accent: "240 4.8% 95.9%",
      accentForeground: "240 5.9% 10%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "240 5.9% 90%",
      input: "240 5.9% 90%",
      ring: "240 5.9% 10%",
    },
    
    // Cores para modo escuro
    dark: {
      background: "222 47% 11%",
      foreground: "0 0% 98%",
      card: "222 47% 11%",
      cardForeground: "0 0% 98%",
      popover: "222 47% 11%",
      popoverForeground: "0 0% 98%",
      primary: "199 89% 48%",
      primaryForeground: "0 0% 98%",
      secondary: "217 33% 17%",
      secondaryForeground: "0 0% 98%",
      muted: "217 33% 17%",
      mutedForeground: "240 5% 64.9%",
      accent: "217 33% 17%",
      accentForeground: "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      border: "217 33% 17%",
      input: "217 33% 17%",
      ring: "224.3 76.3% 48%",
    },
    
    // Esquema de cores de status
    status: {
      info: {
        light: "#3b82f6",
        dark: "#60a5fa",
        background: {
          light: "#eff6ff",
          dark: "#1e3a8a",
        },
      },
      success: {
        light: "#10b981",
        dark: "#34d399",
        background: {
          light: "#ecfdf5",
          dark: "#064e3b",
        },
      },
      warning: {
        light: "#f59e0b",
        dark: "#fbbf24",
        background: {
          light: "#fffbeb",
          dark: "#78350f",
        },
      },
      error: {
        light: "#ef4444",
        dark: "#f87171",
        background: {
          light: "#fef2f2",
          dark: "#7f1d1d",
        },
      },
    },
    
    // Gradientes
    gradients: {
      primary: "linear-gradient(135deg, #0266a1 0%, #0c9fe8 100%)",
      secondary: "linear-gradient(135deg, #065885 0%, #0266a1 100%)",
      accent: "linear-gradient(135deg, #0b4b6f 0%, #065885 100%)",
    },
  };
  
  // Funções auxiliares para manipulação de cores
  export const colorUtils = {
    // Converte HSL para RGB
    hslToRgb(h, s, l) {
      s /= 100;
      l /= 100;
  
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
      return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4))
      ];
    },
    
    // Converte cor hsl(var(--color)) para valor RGB
    getCssVariableColor(cssVar) {
      // Extrair os valores HSL da variável CSS
      const hslMatch = cssVar.match(/hsl\s*\(\s*var\(([^)]+)\)\s*\)/);
      if (!hslMatch) return null;
      
      const varName = hslMatch[1];
      
      // Em um ambiente real, usaríamos getComputedStyle
      // Como estamos em um contexto de código, vamos usar valores padrão
      // como exemplo
      const h = 210; // Azul padrão
      const s = 90;
      const l = 50;
      
      return this.hslToRgb(h, s, l);
    },
    
    // Aplica uma opacidade a uma cor
    withOpacity(color, opacity) {
      if (color.startsWith("hsl")) {
        return color.replace(")", ` / ${opacity})`);
      }
      
      // Implementar para outros formatos de cor se necessário
      return color;
    }
  };