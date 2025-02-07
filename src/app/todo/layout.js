export const metadata = {
  title: "Todo page",
  description: "This is Todo page",
};
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
