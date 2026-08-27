let resolveIntro: () => void;

export const introPromise = new Promise<void>((res) => {
  resolveIntro = res;
});

export function markIntroComplete() {
  resolveIntro();
}