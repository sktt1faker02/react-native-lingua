export const fontFamilies = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typography = {
  h1: {
    size: 32,
    lineHeight: 1.2,
    family: fontFamilies.bold,
    usage: "Page / Screen Title",
  },
  h2: {
    size: 24,
    lineHeight: 1.3,
    family: fontFamilies.semiBold,
    usage: "Section Title",
  },
  h3: {
    size: 20,
    lineHeight: 1.3,
    family: fontFamilies.semiBold,
    usage: "Card / Module Title",
  },
  h4: {
    size: 16,
    lineHeight: 1.4,
    family: fontFamilies.medium,
    usage: "Subheading",
  },
  bodyLarge: {
    size: 16,
    lineHeight: 1.6,
    family: fontFamilies.regular,
    usage: "Important content",
  },
  bodyMedium: {
    size: 14,
    lineHeight: 1.6,
    family: fontFamilies.regular,
    usage: "Body text",
  },
  bodySmall: {
    size: 13,
    lineHeight: 1.6,
    family: fontFamilies.regular,
    usage: "Supporting text",
  },
  caption: {
    size: 11,
    lineHeight: 1.4,
    family: fontFamilies.regular,
    usage: "Labels, meta text",
  },
} as const;

export type TypographyToken = typeof typography;
