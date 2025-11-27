export const FRAMEWORKS = ['react', 'vue'] as const;
export type Framework = (typeof FRAMEWORKS)[number];