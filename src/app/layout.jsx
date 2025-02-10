import "@/app/globals.css";

export const metadata = {
  title: "Todo App",
  description: "Todo App Home Page",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="icon" href="./favicon-old.ico" sizes="any" />
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
