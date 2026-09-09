import { Container } from "@/components/ui/container";
import { getPartnerLogos } from "@/lib/data/partner-logos";

export async function PartnerLogosCarousel() {
  const logos = await getPartnerLogos();
  if (logos.length === 0) return null;

  // Repeat the logo set enough times that each "half" of the track always
  // overflows well past any viewport width — with only a handful of logos,
  // duplicating just once (the old behaviour) meant the whole set fit on
  // screen with barely any runway to actually scroll before looping. Two
  // copies of that (below) still line up seamlessly at the -50% mark.
  const setsPerHalf = Math.max(1, Math.ceil(10 / logos.length));
  const half = Array.from({ length: setsPerHalf }, () => logos).flat();
  const track = [...half, ...half];
  const durationSeconds = Math.max(18, half.length * 3.5);

  return (
    <section className="border-y border-black/5 bg-bg-alt py-10">
      <Container>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-grey">
          Banking Partners &amp; Regulatory Bodies
        </p>
      </Container>

      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          style={{ animationDuration: `${durationSeconds}s` }}
          className="flex w-max animate-[marquee_linear_infinite] items-center gap-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-8 motion-reduce:px-6"
        >
          {track.map((logo, i) => {
            const img = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.logo_url}
                alt={logo.name}
                className="h-10 w-auto max-w-35 object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
              />
            );
            return (
              <div key={`${logo.id}-${i}`} className="shrink-0">
                {logo.link_url ? (
                  <a href={logo.link_url} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
