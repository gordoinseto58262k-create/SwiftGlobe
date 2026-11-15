import { useState } from "react";
import { Flag } from "@/components/Flag";

type Props = { amount: number; fee: number; received: string; country: string; flag: string; onClose: () => void };
const steps = ["Recipient", "Payment", "Review"];
const cls = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2";

export function SendSteps({ amount, fee, received, country, flag, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ nome: "", conta: "", cartao: "", titular: "", validade: "", cvv: "" });
  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });
  const card = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const exp = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
  const ok = [
    f.nome.length > 2 && f.conta.length > 3,
    f.cartao.replace(/\s/g, "").length === 16 && f.titular.length > 2 && f.validade.length === 5 && f.cvv.length >= 3,
    true,
  ][step];
  const total = (amount + fee).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 text-card-foreground shadow-2xl">
        {step < 3 && (
          <div className="mb-6 flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-secondary"}`} />
                <p className={`mt-1 text-xs ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{i + 1}. {s}</p>
              </div>
            ))}
          </div>
        )}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Who are you sending to?</h2>
            <label className="block text-sm">Full name<input className={cls} value={f.nome} onChange={(e) => set("nome", e.target.value)} /></label>
            <label className="block text-sm">Bank account number<input className={cls} value={f.conta} onChange={(e) => set("conta", e.target.value)} /></label>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Pay with card</h2>
            <label className="block text-sm">Card number<input inputMode="numeric" placeholder="0000 0000 0000 0000" className={cls} value={f.cartao} onChange={(e) => set("cartao", card(e.target.value))} /></label>
            <label className="block text-sm">Name on card<input className={cls} value={f.titular} onChange={(e) => set("titular", e.target.value)} /></label>
            <div className="flex gap-3">
              <label className="block flex-1 text-sm">Expiry date<input placeholder="MM/YY" className={cls} value={f.validade} onChange={(e) => set("validade", exp(e.target.value))} /></label>
              <label className="block flex-1 text-sm">CVV<input inputMode="numeric" className={cls} value={f.cvv} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} /></label>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-2 text-sm">
            <h2 className="mb-3 text-xl font-bold">Review your transfer</h2>
            <div className="flex justify-between"><span>Recipient</span><span>{f.nome}</span></div>
            <div className="flex justify-between"><span>Country</span><span className="flex items-center gap-2"><Flag src={flag} />{country}</span></div>
            <div className="flex justify-between"><span>Card</span><span>•••• {f.cartao.slice(-4)}</span></div>
            <div className="flex justify-between"><span>They receive</span><span>{received}</span></div>
            <div className="flex justify-between font-bold"><span>Total charged</span><span>${total}</span></div>
          </div>
        )}
        {step === 3 && (
          <div className="py-6 text-center">
            <div className="text-5xl">✅</div>
            <h2 className="mt-3 text-xl font-bold">Transfer confirmed!</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.nome} will receive {received}.</p>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={step === 0 || step === 3 ? onClose : () => setStep(step - 1)} className="flex-1 rounded-full border border-border py-3 font-semibold">
            {step === 3 ? "Close" : step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 3 && (
            <button disabled={!ok} onClick={() => setStep(step + 1)} className="flex-1 rounded-full bg-accent py-3 font-bold text-accent-foreground disabled:opacity-40">
              {step === 2 ? `Pay $${total}` : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
