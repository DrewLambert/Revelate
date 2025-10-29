'use client';

export default function BetaBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-1.5 text-center">
        <p className="text-xs font-medium text-navy">
          <span className="font-bold">BETA</span> - This site is currently in beta. Features and content may change.
        </p>
      </div>
    </div>
  );
}
