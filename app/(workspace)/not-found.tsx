import Link from "next/link";

export default function UnavailablePage() {
  return (
    <section>
      <h1>This destination is not available</h1>
      <p>
        It may not be available to your account. No restricted details are
        shown.
      </p>
      <Link href="/projects">Back to Projects</Link>
    </section>
  );
}
