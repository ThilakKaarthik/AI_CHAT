"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/some-other-page") {
    return (
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center">
            <div className="text-center">
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/team">Our Team</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
            © {new Date().getFullYear()} ITC Code Assistant. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  // Return null if the current page is not the homepage or any other page where the footer should not appear
  
  return null;
}
