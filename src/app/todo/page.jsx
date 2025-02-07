import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4">
      <h2>This is todo page</h2>
      <Link href="/">Back to home </Link>
    </div>
  );
}
