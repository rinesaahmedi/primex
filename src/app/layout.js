import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
