export interface WallpaperOption {
  id: string;
  name: string;
  category: "solid" | "light" | "patterns";
  previewColor?: string;
  previewGradient?: string;
  cssStyle: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    filter?: string;
  };
}

// Default subtle circular pattern matching PDF screenshots
export const DEFAULT_CHAT_WALLPAPER_STYLE = {
  backgroundColor: "#FFFFFF",
  backgroundImage:
    "radial-gradient(circle, rgba(124, 58, 237, 0.07) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
  backgroundSize: "28px 28px, 14px 14px",
  backgroundPosition: "0 0, 14px 14px",
};

export const DEFAULT_DARK_WALLPAPER_STYLE = {
  backgroundColor: "#111827",
  backgroundImage:
    "radial-gradient(circle, rgba(196, 181, 253, 0.08) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
  backgroundSize: "28px 28px, 14px 14px",
  backgroundPosition: "0 0, 14px 14px",
};

export const SOLID_WALLPAPERS: WallpaperOption[] = [
  { id: "white", name: "White", category: "solid", previewColor: "#FFFFFF", cssStyle: { backgroundColor: "#FFFFFF" } },
  { id: "off-white", name: "Off White", category: "solid", previewColor: "#F9FAFB", cssStyle: { backgroundColor: "#F9FAFB" } },
  { id: "pearl", name: "Pearl", category: "solid", previewColor: "#F3F4F6", cssStyle: { backgroundColor: "#F3F4F6" } },
  { id: "cream", name: "Cream", category: "solid", previewColor: "#FFFBEB", cssStyle: { backgroundColor: "#FFFBEB" } },
  { id: "beige", name: "Beige", category: "solid", previewColor: "#FEF3C7", cssStyle: { backgroundColor: "#FEF3C7" } },
  { id: "ivory", name: "Ivory", category: "solid", previewColor: "#FFFFF0", cssStyle: { backgroundColor: "#FFFFF0" } },
  { id: "light-grey", name: "Light Grey", category: "solid", previewColor: "#E5E7EB", cssStyle: { backgroundColor: "#E5E7EB" } },
  { id: "warm-grey", name: "Warm Grey", category: "solid", previewColor: "#E7E5E4", cssStyle: { backgroundColor: "#E7E5E4" } },
  { id: "ice-blue", name: "Ice Blue", category: "solid", previewColor: "#F0F9FF", cssStyle: { backgroundColor: "#F0F9FF" } },
  { id: "sky-blue", name: "Sky Blue", category: "solid", previewColor: "#E0F2FE", cssStyle: { backgroundColor: "#E0F2FE" } },
  { id: "baby-blue", name: "Baby Blue", category: "solid", previewColor: "#BAE6FD", cssStyle: { backgroundColor: "#BAE6FD" } },
  { id: "mint", name: "Mint", category: "solid", previewColor: "#ECFDF5", cssStyle: { backgroundColor: "#ECFDF5" } },
  { id: "sage", name: "Sage", category: "solid", previewColor: "#E2E8F0", cssStyle: { backgroundColor: "#E2E8F0" } },
  { id: "pale-green", name: "Pale Green", category: "solid", previewColor: "#DCFCE7", cssStyle: { backgroundColor: "#DCFCE7" } },
  { id: "lavender", name: "Lavender", category: "solid", previewColor: "#F3E8FF", cssStyle: { backgroundColor: "#F3E8FF" } },
  { id: "lilac", name: "Lilac", category: "solid", previewColor: "#EDE9FE", cssStyle: { backgroundColor: "#EDE9FE" } },
  { id: "peach", name: "Peach", category: "solid", previewColor: "#FFEDD5", cssStyle: { backgroundColor: "#FFEDD5" } },
  { id: "blush-pink", name: "Blush Pink", category: "solid", previewColor: "#FCE7F3", cssStyle: { backgroundColor: "#FCE7F3" } },
  { id: "pale-yellow", name: "Pale Yellow", category: "solid", previewColor: "#FEF9C3", cssStyle: { backgroundColor: "#FEF9C3" } },
  { id: "soft-cyan", name: "Soft Cyan", category: "solid", previewColor: "#CFFAFE", cssStyle: { backgroundColor: "#CFFAFE" } },
];

export const LIGHT_WALLPAPERS: WallpaperOption[] = [
  {
    id: "paper",
    name: "Paper",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FAF8F5 0%, #F3EFEA 100%)",
    cssStyle: {
      backgroundColor: "#FAF8F5",
      backgroundImage: "linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)",
      backgroundSize: "20px 20px, 20px 20px",
    },
  },
  {
    id: "linen",
    name: "Linen",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F5F4F0 0%, #EBE8E1 100%)",
    cssStyle: {
      backgroundColor: "#F5F4F0",
      backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px)",
    },
  },
  {
    id: "silk",
    name: "Silk",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
    cssStyle: {
      backgroundColor: "#F8FAFC",
      backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(226,232,240,0.4) 100%)",
    },
  },
  {
    id: "canvas",
    name: "Canvas",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FBF9F5 0%, #F0EDE6 100%)",
    cssStyle: {
      backgroundColor: "#FBF9F5",
      backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 0)",
      backgroundSize: "8px 8px",
    },
  },
  {
    id: "parchment",
    name: "Parchment",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FEFDF9 0%, #F6F1E5 100%)",
    cssStyle: {
      backgroundColor: "#FEFDF9",
      backgroundImage: "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.04) 0%, transparent 60%)",
    },
  },
  {
    id: "marble",
    name: "Marble",
    category: "light",
    previewGradient: "linear-gradient(120deg, #F8FAFC 0%, #EDE9FE 50%, #F1F5F9 100%)",
    cssStyle: {
      backgroundColor: "#F8FAFC",
      backgroundImage: "radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)",
    },
  },
  {
    id: "frosted",
    name: "Frosted",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
    cssStyle: {
      backgroundColor: "#F1F5F9",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 20%)",
      backgroundSize: "16px 16px",
    },
  },
  {
    id: "grain",
    name: "Grain",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
    cssStyle: {
      backgroundColor: "#F9FAFB",
      backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
      backgroundSize: "6px 6px",
    },
  },
  {
    id: "mist",
    name: "Mist",
    category: "light",
    previewGradient: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
    cssStyle: {
      backgroundColor: "#F8FAFC",
      backgroundImage: "linear-gradient(180deg, rgba(241,245,249,0.6) 0%, rgba(226,232,240,0.6) 100%)",
    },
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
    cssStyle: {
      backgroundColor: "#F0F9FF",
      backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(186,230,253,0.3) 0%, transparent 50%)",
    },
  },
  {
    id: "sand",
    name: "Sand",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
    cssStyle: {
      backgroundColor: "#FFFBEB",
      backgroundImage: "radial-gradient(rgba(217, 119, 6, 0.05) 1px, transparent 1px)",
      backgroundSize: "10px 10px",
    },
  },
  {
    id: "wood-light",
    name: "Wood Light",
    category: "light",
    previewGradient: "linear-gradient(180deg, #FAF6EE 0%, #F0E8D7 100%)",
    cssStyle: {
      backgroundColor: "#FAF6EE",
      backgroundImage: "repeating-linear-gradient(0deg, rgba(180, 83, 9, 0.02) 0px, rgba(180, 83, 9, 0.02) 1px, transparent 1px, transparent 8px)",
    },
  },
  {
    id: "subtle-grid",
    name: "Subtle Grid",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px)",
      backgroundSize: "24px 24px, 24px 24px",
    },
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #E0E7FF 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #E0E7FF 100%)",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FFF7ED 0%, #FEE2E2 50%, #FDF2F8 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #FFF7ED 0%, #FEE2E2 50%, #FDF2F8 100%)",
    },
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    category: "light",
    previewGradient: "linear-gradient(135deg, #ECFDF5 0%, #EFF6FF 50%, #FAF5FF 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #ECFDF5 0%, #EFF6FF 50%, #FAF5FF 100%)",
    },
  },
  {
    id: "dawn",
    name: "Dawn",
    category: "light",
    previewGradient: "linear-gradient(135deg, #FEF2F2 0%, #FFFBEB 50%, #F0FDF4 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #FEF2F2 0%, #FFFBEB 50%, #F0FDF4 100%)",
    },
  },
  {
    id: "twilight",
    name: "Twilight",
    category: "light",
    previewGradient: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF4FF 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF4FF 100%)",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "light",
    previewGradient: "linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 50%, #F5F3FF 100%)",
    cssStyle: {
      backgroundImage: "linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 50%, #F5F3FF 100%)",
    },
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    category: "light",
    previewGradient: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
    },
  },
];

export const PATTERN_WALLPAPERS: WallpaperOption[] = [
  {
    id: "fine-grid",
    name: "Fine Grid",
    category: "patterns",
    previewGradient: "radial-gradient(#7C3AED 1px, transparent 1px), #FFFFFF",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)",
      backgroundSize: "16px 16px, 16px 16px",
    },
  },
  {
    id: "cross",
    name: "Cross",
    category: "patterns",
    previewGradient: "linear-gradient(#7C3AED, #7C3AED), #FFFFFF",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle, rgba(124,58,237,0.12) 2px, transparent 2px), radial-gradient(circle, rgba(124,58,237,0.08) 2px, transparent 2px)",
      backgroundSize: "24px 24px, 24px 24px",
      backgroundPosition: "0 0, 12px 12px",
    },
  },
  {
    id: "cross-hatch",
    name: "Cross Hatch",
    category: "patterns",
    previewGradient: "linear-gradient(45deg, #EDE9FE 25%, transparent 25%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "repeating-linear-gradient(45deg, rgba(124,58,237,0.06) 0px, rgba(124,58,237,0.06) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, rgba(124,58,237,0.06) 0px, rgba(124,58,237,0.06) 1px, transparent 1px, transparent 12px)",
    },
  },
  {
    id: "diagonal-lines",
    name: "Diagonal Lines",
    category: "patterns",
    previewGradient: "repeating-linear-gradient(45deg, #7C3AED 0px, #7C3AED 2px, #FFFFFF 2px, #FFFFFF 8px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "repeating-linear-gradient(45deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 1.5px, transparent 1.5px, transparent 14px)",
    },
  },
  {
    id: "vertical-lines",
    name: "Vertical Lines",
    category: "patterns",
    previewGradient: "repeating-linear-gradient(90deg, #7C3AED 0px, #7C3AED 2px, #FFFFFF 2px, #FFFFFF 8px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "repeating-linear-gradient(90deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 1.5px, transparent 1.5px, transparent 16px)",
    },
  },
  {
    id: "horizontal-lines",
    name: "Horizontal Lines",
    category: "patterns",
    previewGradient: "repeating-linear-gradient(0deg, #7C3AED 0px, #7C3AED 2px, #FFFFFF 2px, #FFFFFF 8px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "repeating-linear-gradient(0deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 1.5px, transparent 1.5px, transparent 16px)",
    },
  },
  {
    id: "hexagons",
    name: "Hexagons",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #EDE9FE 40%, transparent 40%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.08) 6px, transparent 6px), radial-gradient(circle at 0% 0%, rgba(124,58,237,0.08) 6px, transparent 6px)",
      backgroundSize: "28px 32px",
    },
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #F5F3FF 60%, #EDE9FE 60%)",
    cssStyle: {
      backgroundColor: "#FAF5FF",
      backgroundImage:
        "radial-gradient(circle at 100% 100%, rgba(124,58,237,0.1) 8px, transparent 8px), radial-gradient(circle at 0% 0%, rgba(124,58,237,0.1) 8px, transparent 8px)",
      backgroundSize: "24px 24px",
    },
  },
  {
    id: "triangles",
    name: "Triangles",
    category: "patterns",
    previewGradient: "linear-gradient(45deg, #7C3AED 25%, transparent 25%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(45deg, rgba(124,58,237,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(124,58,237,0.06) 25%, transparent 25%)",
      backgroundSize: "24px 24px",
    },
  },
  {
    id: "squares",
    name: "Squares",
    category: "patterns",
    previewGradient: "linear-gradient(45deg, #EDE9FE 25%, transparent 25%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(rgba(124,58,237,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(124,58,237,0.08) 2px, transparent 2px)",
      backgroundSize: "32px 32px",
    },
  },
  {
    id: "rounded-squares",
    name: "Rounded Squares",
    category: "patterns",
    previewGradient: "radial-gradient(#EDE9FE 50%, transparent 50%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.09) 10px, transparent 10px)",
      backgroundSize: "32px 32px",
    },
  },
  {
    id: "diamonds",
    name: "Diamonds",
    category: "patterns",
    previewGradient: "linear-gradient(135deg, #7C3AED 25%, transparent 25%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(135deg, rgba(124,58,237,0.07) 25%, transparent 25%), linear-gradient(225deg, rgba(124,58,237,0.07) 25%, transparent 25%), linear-gradient(315deg, rgba(124,58,237,0.07) 25%, transparent 25%), linear-gradient(45deg, rgba(124,58,237,0.07) 25%, transparent 25%)",
      backgroundSize: "24px 24px",
      backgroundPosition: "-12px 0, -12px 0, 0 -12px, 0 -12px",
    },
  },
  {
    id: "waves",
    name: "Waves",
    category: "patterns",
    previewGradient: "radial-gradient(circle at 50% 100%, #EDE9FE 40%, transparent 40%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08) 12px, transparent 12px), radial-gradient(circle at 50% 100%, rgba(124,58,237,0.08) 12px, transparent 12px)",
      backgroundSize: "24px 24px",
    },
  },
  {
    id: "organic-shapes",
    name: "Organic Shapes",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #F5F3FF 40%, #EDE9FE 80%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.08) 10px, transparent 10px), radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.07) 12px, transparent 12px)",
      backgroundSize: "36px 36px",
    },
  },
  {
    id: "circles",
    name: "Circles",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #7C3AED 2px, #FFFFFF 2px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.12) 3px, transparent 3px)",
      backgroundSize: "24px 24px",
    },
  },
  {
    id: "rings",
    name: "Rings",
    category: "patterns",
    previewGradient: "radial-gradient(circle, transparent 6px, #7C3AED 6px, #7C3AED 8px, transparent 8px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle, transparent 6px, rgba(124,58,237,0.1) 6px, rgba(124,58,237,0.1) 8px, transparent 8px)",
      backgroundSize: "28px 28px",
    },
  },
  {
    id: "ripple",
    name: "Ripple",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #F5F3FF 20%, #EDE9FE 40%, transparent 60%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "radial-gradient(circle, rgba(124,58,237,0.08) 4px, transparent 4px), radial-gradient(circle, rgba(124,58,237,0.05) 10px, transparent 10px)",
      backgroundSize: "32px 32px",
    },
  },
  {
    id: "plus-pattern",
    name: "Plus Pattern",
    category: "patterns",
    previewGradient: "radial-gradient(#7C3AED 1px, transparent 1px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(rgba(124,58,237,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(124,58,237,0.1) 2px, transparent 2px)",
      backgroundSize: "20px 20px, 20px 20px",
      backgroundPosition: "0 0, 0 0",
    },
  },
  {
    id: "stars",
    name: "Stars",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #FDE047 30%, transparent 30%)",
    cssStyle: {
      backgroundColor: "#FEFCE8",
      backgroundImage:
        "radial-gradient(circle, rgba(234, 179, 8, 0.15) 2px, transparent 2px), radial-gradient(circle, rgba(124, 58, 237, 0.08) 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px, 12px 12px",
    },
  },
  {
    id: "mosaic",
    name: "Mosaic",
    category: "patterns",
    previewGradient: "linear-gradient(45deg, #EDE9FE 25%, #DDD6FE 25%, #DDD6FE 50%, #C4B5FD 50%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(45deg, rgba(124,58,237,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(124,58,237,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(124,58,237,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(124,58,237,0.06) 75%)",
      backgroundSize: "20px 20px",
    },
  },
  {
    id: "abstract",
    name: "Abstract",
    category: "patterns",
    previewGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #C4B5FD 100%)",
    cssStyle: {
      backgroundColor: "#F5F3FF",
      backgroundImage:
        "radial-gradient(circle at 10% 20%, rgba(124,58,237,0.08) 0%, transparent 30%), radial-gradient(circle at 90% 80%, rgba(236,72,153,0.06) 0%, transparent 30%)",
    },
  },
  {
    id: "geometric",
    name: "Geometric",
    category: "patterns",
    previewGradient: "linear-gradient(135deg, #EDE9FE 25%, #F5F3FF 25%, #F5F3FF 50%, #EDE9FE 50%)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(30deg, rgba(124,58,237,0.06) 12%, transparent 12.5%, transparent 87%, rgba(124,58,237,0.06) 87.5%, rgba(124,58,237,0.06)), linear-gradient(150deg, rgba(124,58,237,0.06) 12%, transparent 12.5%, transparent 87%, rgba(124,58,237,0.06) 87.5%, rgba(124,58,237,0.06))",
      backgroundSize: "28px 48px",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "patterns",
    previewGradient: "radial-gradient(#9CA3AF 1px, transparent 1px)",
    cssStyle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: "radial-gradient(circle, rgba(156, 163, 175, 0.2) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },
  },
  {
    id: "modern",
    name: "Modern",
    category: "patterns",
    previewGradient: "linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 100%)",
    cssStyle: {
      backgroundColor: "#F8FAFC",
      backgroundImage: "linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(99,102,241,0.05) 100%)",
    },
  },
  {
    id: "confetti",
    name: "Confetti",
    category: "patterns",
    previewGradient: "radial-gradient(#EC4899 2px, #8B5CF6 2px, transparent 3px)",
    cssStyle: {
      backgroundColor: "#FDF4FF",
      backgroundImage:
        "radial-gradient(circle, rgba(236,72,153,0.12) 2px, transparent 2px), radial-gradient(circle, rgba(124,58,237,0.12) 2px, transparent 2px), radial-gradient(circle, rgba(59,130,246,0.1) 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px, 32px 32px, 16px 16px",
      backgroundPosition: "0 0, 12px 12px, 6px 6px",
    },
  },
  {
    id: "leaves",
    name: "Leaves",
    category: "patterns",
    previewGradient: "radial-gradient(#10B981 30%, transparent 30%)",
    cssStyle: {
      backgroundColor: "#F0FDF4",
      backgroundImage:
        "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.1) 6px, transparent 6px), radial-gradient(ellipse at 0% 0%, rgba(16, 185, 129, 0.08) 6px, transparent 6px)",
      backgroundSize: "28px 28px",
    },
  },
  {
    id: "pebbles",
    name: "Pebbles",
    category: "patterns",
    previewGradient: "radial-gradient(circle, #CBD5E1 40%, transparent 40%)",
    cssStyle: {
      backgroundColor: "#F8FAFC",
      backgroundImage:
        "radial-gradient(circle at 30% 40%, rgba(148, 163, 184, 0.15) 5px, transparent 5px), radial-gradient(circle at 70% 80%, rgba(148, 163, 184, 0.12) 7px, transparent 7px)",
      backgroundSize: "32px 32px",
    },
  },
];

export const ALL_WALLPAPERS: WallpaperOption[] = [
  ...SOLID_WALLPAPERS,
  ...LIGHT_WALLPAPERS,
  ...PATTERN_WALLPAPERS,
];
