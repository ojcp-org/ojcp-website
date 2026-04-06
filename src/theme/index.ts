import { createTheme, MantineColorsTuple } from "@mantine/core";

const ojcpGold: MantineColorsTuple = [
  "#fdf5e5",
  "#f6e4b8",
  "#f0d08a",
  "#e8a830", // 3 - primary accent
  "#d49520",
  "#b87e1a",
  "#9c6815",
  "#805210",
  "#643e0c",
  "#4a2c08",
];

const ojcpBlue: MantineColorsTuple = [
  "#e8f2fb",
  "#c8ddf2",
  "#9ec4e6",
  "#5b9fd4", // 3 - secondary (code, links)
  "#3d80b8",
  "#2e6a9e",
  "#245684",
  "#1b436a",
  "#133252",
  "#0c223a",
];

export const theme = createTheme({
  primaryColor: "ojcpGold",
  primaryShade: 3,
  colors: {
    ojcpGold,
    ojcpBlue,
    dark: [
      "#ececf0", // 0 - primary text
      "#b8b8c4", // 1 - secondary text
      "#9090a0", // 2
      "#6b6b78", // 3 - muted text
      "#3a3a46", // 4
      "#28282f", // 5
      "#1e1e26", // 6 - elevated bg
      "#18181e", // 7 - surface bg
      "#111116", // 8 - alt bg
      "#0c0c0f", // 9 - primary bg (obsidian)
    ],
  },
  fontFamily:
    "'JetBrains Mono', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
  headings: {
    fontFamily:
      "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
    fontWeight: "700",
  },
  defaultRadius: "sm",
});
