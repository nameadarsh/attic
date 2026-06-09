import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-48 px-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl space-y-4">
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
          This wasn&apos;t made to impress anyone.
        </p>
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
          It&apos;s just a place I wanted to keep a record of things that are close to me.
        </p>
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
          You&apos;re welcome to stay.
        </p>
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
          You&apos;re welcome to leave.
        </p>
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
          Be kind to the world.
        </p>
      </div>
    </footer>
  );
}
