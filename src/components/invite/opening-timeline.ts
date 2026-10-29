export const OPENING = {
  hold: 1200,
  swing: 4500,
  flash: 1000,
  quote: 5200,
  exit: 1000,
} as const;

export function openingMilestones(reduced = false) {
  const flashAt = reduced ? 0 : OPENING.hold + OPENING.swing;
  const quoteAt = reduced ? 100 : flashAt + OPENING.flash;
  const welcomeAt = quoteAt + OPENING.quote;
  return { flashAt, quoteAt, welcomeAt, removeAt: welcomeAt + (reduced ? 50 : OPENING.exit) };
}