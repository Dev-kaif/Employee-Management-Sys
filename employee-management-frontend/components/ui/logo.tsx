export default function Logo() {
    return (
      <div className="flex items-baseline text-2xl font-bold text-neutral-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo.svg" alt="W logo" className="h-6 w-6" />
        <span>orkNest</span>
      </div>
    );
  }
  