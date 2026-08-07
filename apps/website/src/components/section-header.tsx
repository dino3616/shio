export const SectionHeader = ({
  number,
  title,
  jp,
}: {
  number: string;
  title: string;
  jp: string;
}) => (
  <div className="flex items-baseline gap-5">
    <span className="font-mono text-pink text-sm">{number} /</span>
    <h2 className="font-display text-4xl font-bold tracking-wide md:text-5xl">{title}</h2>
    <span className="font-pixel text-ice hidden text-sm md:inline">{jp}</span>
  </div>
);
