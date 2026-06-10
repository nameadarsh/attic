export default function ColophonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-6 md:p-24 pt-40 md:pt-40">
        <div className="max-w-2xl text-center space-y-10">
          <h1 className="text-xl md:text-2xl uppercase tracking-[0.5em] text-white/30">Colophon</h1>
          <p className="text-xl md:text-3xl font-light text-white/90 leading-relaxed italic">
            If you&apos;ve come this deep into the attic, you&apos;re either someone I care about or someone unusually curious.
          </p>
          <p className="text-xl md:text-3xl font-light text-white/90 leading-relaxed italic">
            Either way, it&apos;s nice to know you were here.
          </p>
          <div className="h-px w-24 bg-accent-warm/20 mx-auto mt-20" />
        </div>
      </div>
    </div>
  );
}
