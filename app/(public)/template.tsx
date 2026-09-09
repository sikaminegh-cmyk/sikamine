// Re-mounts on every navigation (unlike layout.tsx), giving each route a
// subtle fade + rise entrance without a client-side router event listener.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-[pageEnter_0.5s_ease-out]">{children}</div>;
}
