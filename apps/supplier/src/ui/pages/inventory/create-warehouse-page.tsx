import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, SuccessModal } from '@energyiq/ui';
import { mockWarehouseAction } from './mocks';
import { CreateWarehouseForm } from '@/ui/components/warehouse/create-warehouse-form';

export function CreateWarehousePage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdName, setCreatedName] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const backToInventory = () => navigate(`/${slug}/inventory`);

  const handleSave = async (name: string) => {
    setCreatedName(name);
    setIsProcessing(true);
    await mockWarehouseAction();
    setIsProcessing(false);
    setSuccessOpen(true);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={backToInventory}
          aria-label="Back to inventory"
          className="w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Create Warehouse</h1>
      </header>

      <CreateWarehouseForm key={resetKey} onCancel={backToInventory} onSave={handleSave} />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        tone="brand"
        buttonLayout="row"
        title="Warehouse Created Successfully"
        subtitle={
          <>
            <span className="text-brand font-semibold">{createdName || 'The warehouse'}</span> has been
            created and added to your inventory.
          </>
        }
        primaryAction={{ label: 'Go to Inventory', onClick: backToInventory }}
        secondaryAction={{
          label: 'Create Another',
          onClick: () => {
            setSuccessOpen(false);
            setResetKey((key) => key + 1);
          },
        }}
      />

      {isProcessing && <LoadingOverlay message="Creating warehouse..." />}
    </section>
  );
}
