/**
 * The projector-room layer: film grain, scanlines and a vignette pinned above the page.
 * Purely decorative and non-interactive, so it never blocks clicks.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__grain" />
      <div className="atmosphere__scanlines" />
      <div className="atmosphere__vignette" />
    </div>
  );
}
