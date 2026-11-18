export default function Loading() {
  return <main aria-label="Loading Ruthie Bank" className="min-h-screen bg-[#f5f7f5] p-5 md:flex md:p-8">
    <div className="mx-auto flex w-full max-w-6xl gap-8">
      <aside className="hidden w-56 shrink-0 space-y-7 md:block" aria-hidden="true">
        <div className="flex items-center gap-3"><img src="/ruthie-mark.svg" alt="" className="h-10 w-10"/><div className="h-4 w-24 animate-pulse rounded bg-[#dfe8e2]"/></div>
        {[1, 2, 3, 4, 5].map((row) => <div key={row} className="h-10 animate-pulse rounded-xl bg-[#e8eeea]"/>)}
      </aside>
      <section className="flex-1" aria-hidden="true">
        <div className="mb-8 flex items-center justify-between"><div className="space-y-2"><div className="h-3 w-32 animate-pulse rounded bg-[#dfe8e2]"/><div className="h-6 w-52 animate-pulse rounded bg-[#dfe8e2]"/></div><div className="h-10 w-10 animate-pulse rounded-full bg-[#dfe8e2]"/></div>
        <div className="grid gap-5 lg:grid-cols-2"><div className="h-56 animate-pulse rounded-[26px] bg-[#dce8e1]"/><div className="h-56 animate-pulse rounded-[26px] bg-[#e8eeea]"/></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="h-72 animate-pulse rounded-[26px] bg-[#e8eeea]"/><div className="h-72 animate-pulse rounded-[26px] bg-[#e8eeea]"/></div>
        <p className="mt-8 text-center text-xs text-[#71817a]">Preparing your Ruthie Bank preview…</p>
      </section>
    </div>
  </main>;
}
