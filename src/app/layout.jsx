import "@/app/globals.css";

export const metadata = {
  title: "Home page",
  description: "This is Home page",
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
