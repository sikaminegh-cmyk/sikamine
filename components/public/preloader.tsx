export function Preloader() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 flex items-center justify-center bg-navy motion-safe:animate-[preloaderFade_1s_ease-in-out_forwards] motion-reduce:hidden"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-orange font-heading text-2xl font-bold text-orange motion-safe:animate-[preloaderMark_1s_ease-in-out_forwards]">
        S
      </div>
    </div>
  );
}
