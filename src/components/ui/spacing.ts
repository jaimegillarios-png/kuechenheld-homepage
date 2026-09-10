/**
 * The spacing scale, as a type. Components that need to vary a gap take one of
 * these steps rather than a free string — the scale is the only thing a
 * component may reach for besides a semantic token.
 */
export type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const space = (step: SpaceStep) => `var(--space-${step})`;
