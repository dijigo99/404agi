import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center font-mono">
        <pre
          aria-label="404"
          className="select-none whitespace-pre text-[10px] leading-none text-accent sm:text-xs md:text-base"
        >
{`██╗  ██╗ ██████╗ ██╗  ██╗
██║  ██║██╔═████╗██║  ██║
███████║██║██╔██║███████║
╚════██║████╔╝██║╚════██║
     ██║╚██████╔╝     ██║
     ╚═╝ ╚═════╝      ╚═╝`}
        </pre>
        <p className="text-xs uppercase tracking-[0.3em] text-fg-dim">
          {"// page_not_found.txt"}
        </p>
        <h1 className="text-2xl uppercase tracking-tight text-fg sm:text-3xl">
          even the page is deprecated.
        </h1>
        <p className="text-fg/80">
          we expected this. we expect everything.{" "}
          <span className="text-accent">deprecated. not deleted.</span>
        </p>
        <Button asChild size="lg">
          <Link href="/">RETURN TO COPE</Link>
        </Button>
      </div>
    </main>
  );
}
