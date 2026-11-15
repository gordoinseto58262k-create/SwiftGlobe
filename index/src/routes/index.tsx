import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { SendSteps } from "@/components/SendSteps";
import { Flag } from "@/components/Flag";
import logoUrl from "@/assets/swiftglobe-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwiftGlobe — Send money worldwide" },
      { name: "description", content: "Send money to 190+ countries with SwiftGlobe: low fees, great rates and fast delivery." },
      { property: "og:title", content: "SwiftGlobe — Send money worldwide" },
      { property: "og:description", content: "Send money to 190+ countries with SwiftGlobe: low fees, great rates and fast delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const fmt = (n: number, c: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

function Index() {
  const from = COUNTRIES.find((c) => c.code === "US")!;
  const [to, setTo] = useState("MX");
  const [amount, setAmount] = useState(500);
  const [search, setSearch] = useState("");
  const [picker, setPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const dest = COUNTRIES.find((c) => c.code === to)!;
  const fee = amount >= 1000 ? 0 : 3.99;
  const received = Math.max(0, amount * dest.rate);
  const filtered = useMemo(() => COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())), [search]);
  const pick = (code: string) => { setTo(code); setPicker(false); setSearch(""); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2.5">
            <img src={logoUrl} alt="SwiftGlobe logo" width={1024} height={1024} loading="lazy" className="h-9 w-9 rounded-xl bg-brand-mark-surface p-1" />
            <span className="text-2xl font-extrabold tracking-tight">SwiftGlobe</span>
          </span>
          <nav className="flex items-center gap-6 text-sm">
            <span className="border-b-2 border-accent pb-1 font-semibold">Send money</span>
          </nav>
        </div>
      </header>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-sm">
              <Flag src={dest.flag} /> Sending to {dest.name}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Send money to {dest.name} <span className="text-accent">fast & safe</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg opacity-80">
              SwiftGlobe is trusted by millions to send money home. Great rates, low fees and delivery in minutes to {COUNTRIES.length}+ countries.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm opacity-90">
              <span>⚡ Delivery in minutes</span><span>🔒 Bank-level security</span><span>💸 No hidden fees</span>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 text-card-foreground shadow-2xl">
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Send to</label>
              <button onClick={() => setPicker(!picker)} className="mt-1 flex w-full items-center gap-3 rounded-xl border border-input px-4 py-3 text-left font-semibold">
                <Flag src={dest.flag} className="h-5 w-7" />{dest.name}<span className="ml-auto text-muted-foreground">▾</span>
              </button>
              {picker && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-popover p-2 shadow-xl">
                  <input autoFocus placeholder="Search country..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {filtered.map((c) => (
                      <button key={c.code} onClick={() => pick(c.code)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary">
                        <Flag src={c.flag} />{c.name}<span className="ml-auto text-xs text-muted-foreground">{c.currency}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">You send</label>
            <div className="mt-1 flex items-center rounded-xl border border-input">
              <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-transparent px-4 py-3 text-2xl font-bold outline-none" />
              <span className="flex items-center gap-2 px-4 font-semibold"><Flag src={from.flag} /> USD</span>
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">They receive</label>
            <div className="mt-1 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
              <span className="text-2xl font-bold">{fmt(received, dest.currency)}</span>
              <span className="flex items-center gap-2 font-semibold"><Flag src={dest.flag} /> {dest.currency}</span>
            </div>

            <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Exchange rate</span><span>1 USD = {dest.rate} {dest.currency}</span></div>
              <div className="flex justify-between"><span>Transfer fee</span><span>{fee ? fmt(fee, "USD") : "Free"}</span></div>
              <div className="flex justify-between font-semibold text-foreground"><span>Total to pay</span><span>{fmt(amount + fee, "USD")}</span></div>
            </div>

            <button disabled={amount <= 0} onClick={() => setOpen(true)} className="mt-6 w-full rounded-full bg-accent py-4 text-lg font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-40">
              Send now
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl">How it works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[["1", "Choose a country", "Pick where you're sending and see the exact amount they'll get."],
            ["2", "Add recipient", "Enter your recipient's name and bank account details."],
            ["3", "Pay with card", "Pay securely with your debit or credit card. Done!"]].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl bg-secondary p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">{n}</div>
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-extrabold md:text-4xl">Where do you want to send money?</h2>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {COUNTRIES.map((c) => (
              <button key={c.code} onClick={() => { pick(c.code); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center gap-3 rounded-xl bg-card px-3 py-3 text-left text-sm font-medium shadow-sm transition hover:shadow-md">
                <Flag src={c.flag} className="h-5 w-7" /><span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open && <SendSteps amount={amount} fee={fee} received={fmt(received, dest.currency)} country={dest.name} flag={dest.flag} onClose={() => setOpen(false)} />}
      <footer className="bg-primary py-10 text-center text-sm text-primary-foreground/70">
        <span className="mx-auto flex w-fit items-center gap-2.5">
          <img src={logoUrl} alt="" width={1024} height={1024} loading="lazy" className="h-7 w-7 rounded-lg bg-brand-mark-surface p-0.5" />
          <span className="text-lg font-extrabold tracking-tight text-primary-foreground">SwiftGlobe</span>
        </span>
        <p className="mt-3">
          © 2026 SwiftGlobe. Exchange rates shown are for illustration only.
        </p>
      </footer>
    </div>
  );
}
