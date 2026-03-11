import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "TheTravStory",
  description: "AI-powered travel planning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-sky-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
