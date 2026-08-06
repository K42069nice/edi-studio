"use client";

import SourceCard from "../SourceCard";

type Props = {
  hasPackages: boolean;
  expanded: boolean;
  onExpand(): void;
  onCollapse(): void;
  children: React.ReactNode;
};

export default function BottomPanel({
  hasPackages,
  expanded,
  onExpand,
  onCollapse,
  children,
}: Props) {
  return (
    <div
      className={`
        grid
        gap-6
        transition-all
        duration-300
        ${expanded ? "grid-cols-1" : "grid-cols-[minmax(320px,540px)_1fr]"}
      `}
    >
      {!expanded && <SourceCard />}

      <div
        onMouseEnter={() => {
          if (hasPackages) {
            onExpand();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
