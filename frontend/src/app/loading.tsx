import TerminalLoader from '@/components/TerminalLoader';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <TerminalLoader text="loading page" />
    </div>
  );
}
