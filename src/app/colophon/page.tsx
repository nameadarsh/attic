import Navbar from "@/components/Navbar";

export default function ColophonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-24">
        <div className="max-w-xl text-center space-y-8">
          <h1 className="text-xl uppercase tracking-[0.4em] text-white/40">Colophon</h1>
          <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed italic">
            If you&apos;ve come this deep into the attic, you&apos;re either someone I care about or someone unusually curious.
          </p>
          <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed italic">
            Either way, it&apos;s nice to know you were here.
          </p>
        </div>
      </div>
    </div>
  );
}
