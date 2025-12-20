import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-20 py-6 text-center text-sm text-gray-500">
      <div className="flex justify-center gap-6 mb-2">
        <p>© {new Date().getFullYear()} ReelZy. All rights reserved.</p>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/disclaimer" className="hover:underline">
          Disclaimer
        </Link>
      </div>
      
    </footer>
  );
}
