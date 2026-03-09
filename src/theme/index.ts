import { createTheme, MantineColorsTuple } from "@mantine/core";

const ojcpCyan: MantineColorsTuple = [
  "#e5faff",
  "#d1f3ff",
  "#a1e5ff",
  "#6ed7ff",
  "#44cbfe",
  "#2bc4fe",
  "#00c2e8", // 6 - primary
  "#0099cc",
  "#0088b5",
  "#00769e",
];

const ojcpTeal: MantineColorsTuple = [
  "#e4f7fc",
  "#c8edf7",
  "#8ed8ef",
  "#50c2e7",
  "#1e8fb5", // 4 - brand ring
  "#1a7fa1",
  "#166f8d",
  "#115f7a",
  "#0d4f66",
  "#083f53",
];

export const theme = createTheme({
  primaryColor: "ojcpCyan",
  colors: {
    ojcpCyan,
    ojcpTeal,
    dark: [
      "#e8f4fa",
      "#c1d8e8",
      "#8ab8d4",
      "#4a7a9b",
      "#2a4d6b",
      "#1a3550",
      "#0f2740",
      "#0b1e2d",
      "#0b1623",
      "#06101a",
    ],
  },
  fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontFamilyMonospace:
    "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
  headings: {
    fontFamily:
      "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: "600",
  },
  defaultRadius: "md",
});
