/**
 * 要素がビューポート内にあるかを IntersectionObserver で監視する薄いヘルパー。
 * 画面外の演出のフレーム購読を止めるために使う。
 * rootMargin で少し手前から「見えている」扱いにして、境界での再開を滑らかにする
 */
export const whenInView = (
  element: Element,
  onChange: (visible: boolean) => void,
): (() => void) => {
  const observer = new IntersectionObserver(
    (entries) => {
      const latest = entries[entries.length - 1];
      if (latest !== undefined) {
        onChange(latest.isIntersecting);
      }
    },
    { rootMargin: "120px" },
  );
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
};
