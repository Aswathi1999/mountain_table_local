/** Re-mounts on every navigation, so each page fades in once over half a second (see `.page-in` in globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
