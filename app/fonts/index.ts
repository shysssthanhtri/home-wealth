import localFont from "next/font/local";

const geistSans = localFont({
  src: [
    {
      path: "./Geist/static/Geist-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Geist/static/Geist-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "./Geist_Mono/static/GeistMono-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Geist_Mono/static/GeistMono-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

export { geistMono, geistSans };
