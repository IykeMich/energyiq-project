import { useState } from 'react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog, toast } from '@energyiq/ui';
import {
  useGetV1DocumentCategoryList,
  usePostV1DocumentCategoryCreate,
  usePutV1DocumentCategoryUpdateId,
  useDeleteV1DocumentCategoryDeleteId,
  getGetV1DocumentCategoryListQueryKey,
} from '@energyiq/api/generated/document-categories/document-categories';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
import {
  KycDocumentCategoryModal,
  type DocumentCategoryModalTarget,
} from './kyc-document-category-modal';

interface CategoryRow {
  id: string;
  name: string;
}

/** "Document Categories" configuration page — the reference list `document_category_id` picks from. */
export function KycDocumentCategoriesOverview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = 'demo' } = useParams<{ slug: string }>();

  const [modalTarget, setModalTarget] = useState<DocumentCategoryModalTarget | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  const { data, isLoading } = useGetV1DocumentCategoryList();
  const createCategory = usePostV1DocumentCategoryCreate();
  const updateCategory = usePutV1DocumentCategoryUpdateId();
  const deleteCategory = useDeleteV1DocumentCategoryDeleteId();

  const rows: CategoryRow[] = (data?.data?.data ?? []).map((category) => ({
    id: category.id ?? '',
    name: category.document_category ?? '',
  }));

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getGetV1DocumentCategoryListQueryKey() });

  const openCreate = () => {
    setModalTarget({ name: '' });
    setModalOpen(true);
  };

  const openEdit = (row: CategoryRow) => {
    setModalTarget({ id: row.id, name: row.name });
    setModalOpen(true);
  };

  const handleSave = async (name: string) => {
    try {
      if (modalTarget?.id) {
        await updateCategory.mutateAsync({ id: modalTarget.id, data: { document_category: name } });
        toast.success('Category updated', { description: `'${name}' has been updated.` });
      } else {
        await createCategory.mutateAsync({ data: { document_category: name } });
        toast.success('Category created', { description: `'${name}' is now available for document types.` });
      }
      await refresh();
      setModalOpen(false);
    } catch {
      toast.error(modalTarget?.id ? 'Could not update category' : 'Could not create category', {
        description: 'Please try again.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync({ id: deleteTarget.id });
      await refresh();
      toast.success('Category deleted', { description: `'${deleteTarget.name}' has been removed.` });
    } catch {
      toast.error('Could not delete category', {
        description: 'Document types still referencing this category must be reassigned first.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<CategoryRow>[] = [
    { header: 'Category Name', accessor: 'name', sortable: true },
    {
      header: 'Action',
      accessor: 'id',
      align: 'center',
      render: (_value, row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openEdit(row)}
            aria-label="Edit category"
            className="tap-effect text-[#FBC02D]"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete category"
            className="tap-effect text-[#FBC02D]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/kyc-documents/types`)}
            aria-label="Back to document types"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-white">Document Categories</h1>
            <p className="text-sm text-gray-400">
              Categories that document types can be grouped under.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="tap-effect inline-flex items-center gap-1.5 rounded-full bg-[#FBC02D] px-5 py-2.5 text-sm font-semibold text-[#121212]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </button>
      </header>

      <div className="rounded-[18px] bg-[#6161611A] p-6">
        <DefaultTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          getRowId={(row) => row.id}
          noDataMessage="No document categories yet"
        />
      </div>

      <KycDocumentCategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        target={modalTarget}
        onSave={handleSave}
        isSaving={createCategory.isPending || updateCategory.isPending}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Document Category"
        message={
          <>
            Are you sure you want to delete &apos;{deleteTarget?.name}&apos;?
            <br />
            <span className="text-muted-foreground">
              This only succeeds if no active document type still references it.
            </span>
          </>
        }
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
