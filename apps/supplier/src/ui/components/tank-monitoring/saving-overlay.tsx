import { LoadingOverlay } from '@energyiq/ui';

interface SavingOverlayProps {
  message?: string;
}

export function SavingOverlay({ message = 'Saving Reading...' }: SavingOverlayProps) {
  return <LoadingOverlay message={message} />;
}
