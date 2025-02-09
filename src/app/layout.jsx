import Footer from "@/components/footer";
import Header from "@/components/header";

import "@/app/globals.css"; // Sesuaikan path dengan proyek Anda

export const metadata = {
  title: "Home page",
  description: "This is Home page",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* <Header /> */}
        <div>{children}</div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
