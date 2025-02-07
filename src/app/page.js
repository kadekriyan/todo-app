import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>This is home page</h2>
      <Link href="/todo">Go to another page </Link>
    </div>
  );
}
