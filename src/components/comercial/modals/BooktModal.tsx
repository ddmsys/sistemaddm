// src/components/comercial/modals/BooktModal.tsx
// ✅ REFEITO COMPLETO - compatível com SEU books.ts original

"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

// ✅ Import usando SEUS enums EXATOS
import {
  BindingType,
  Book,
  BookFormat,
  CoverColor,
  CoverPaper,
  FinishingType,
  InteriorColor,
  InteriorPaper,
} from "@/lib/types/books";

// ✅ Interface usando a estrutura ANINHADA do seu BookSpecifications
interface BookFormData {
  catalogCode?: string;
  title: string;
  author?: string;
  clientId?: string;
  budgetId?: string;

  // ✅ Specifications usando estrutura ANINHADA igual do SEU type
  specifications?: {
    format: BookFormat;
    customFormat?: string;

    cover: {
      paper: CoverPaper;
      customPaper?: string;
      color: CoverColor;
      customColor?: string;
      finishing: FinishingType;
      customFinishing?: string;
      hasFlapWings: boolean;
    };

    interior: {
      pageCount: number;
      paper: InteriorPaper;
      customPaper?: string;
      color: InteriorColor;
      customColor?: string;
    };

    binding: BindingType;
    customBinding?: string;
    hasShrinkWrap: boolean;
    notes?: string;
  };

  notes?: string;
  tags?: string[];
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookFormData) => void;
  initialData?: Partial<Book>;
  title?: string;
}

// ✅ OPTIONS usando SEUS enums EXATOS
const FORMAT_OPTIONS = [
  { value: BookFormat.F_140x210, label: "140x210mm" },
  { value: BookFormat.F_160x230, label: "160x230mm" },
  { value: BookFormat.F_A4, label: "A4 (210x297mm)" },
  { value: BookFormat.CUSTOM, label: "Personalizado" },
];

const PAPER_OPTIONS = [
  { value: InteriorPaper.AVENA_80G, label: "Avena 80g" },
  { value: InteriorPaper.POLEN_SOFT_80G, label: "Pólen Soft 80g" },
  { value: InteriorPaper.POLEN_BOLD_90G, label: "Pólen Bold 90g" },
  { value: InteriorPaper.COUCHE_115G, label: "Couché 115g" },
  { value: InteriorPaper.COUCHE_150G, label: "Couché 150g" },
  { value: InteriorPaper.OFFSET_90G, label: "Offset 90g" },
  { value: InteriorPaper.CUSTOM, label: "Personalizado" },
];

const COVER_PAPER_OPTIONS = [
  { value: CoverPaper.TRILEX_330G, label: "Trilex 330g" },
  { value: CoverPaper.SUPREMO_250G, label: "Supremo 250g" },
  { value: CoverPaper.SUPREMO_350G, label: "Supremo 350g" },
  { value: CoverPaper.COUCHE_250G, label: "Couché 250g" },
  { value: CoverPaper.CUSTOM, label: "Personalizado" },
];

const BINDING_OPTIONS = [
  { value: BindingType.PAPERBACK, label: "Brochura" },
  { value: BindingType.HARDCOVER, label: "Capa dura" },
  { value: BindingType.SADDLE_STITCH, label: "Grampo canoa" },
  { value: BindingType.SEWN, label: "Costura" },
  { value: BindingType.CUSTOM, label: "Personalizado" },
];

const FINISHING_OPTIONS = [
  { value: FinishingType.MATTE_LAMINATION, label: "Laminação Fosca" },
  { value: FinishingType.MATTE_LAMINATION_SPOT_UV, label: "Laminação Fosca + Verniz com Reserva" },
  { value: FinishingType.GLOSS_LAMINATION, label: "Laminação Brilho" },
  { value: FinishingType.VARNISH, label: "Verniz" },
  { value: FinishingType.SPOT_VARNISH, label: "Verniz com Reserva" },
  { value: FinishingType.HOT_STAMPING, label: "Hot Stamping" },
  { value: FinishingType.CUSTOM, label: "Personalizado" },
];

const INTERIOR_COLOR_OPTIONS = [
  { value: InteriorColor.C_1x1, label: "1x1 cor" },
  { value: InteriorColor.C_2x2, label: "2x2 cores" },
  { value: InteriorColor.C_4x4, label: "4x4 cores" },
  { value: InteriorColor.CUSTOM, label: "Personalizado" },
];

const COVER_COLOR_OPTIONS = [
  { value: CoverColor.C_4x0, label: "4x0 cor" },
  { value: CoverColor.C_4x1, label: "4x1 cor" },
  { value: CoverColor.C_4x4, label: "4x4 cores" },
  { value: CoverColor.CUSTOM, label: "Personalizado" },
];

export default function BookModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Novo Livro",
}: BookModalProps) {
  // ✅ FormData com estrutura ANINHADA igual do SEU type
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    specifications: {
      format: BookFormat.F_A4,
      cover: {
        paper: CoverPaper.TRILEX_330G,
        color: CoverColor.C_4x0,
        finishing: FinishingType.MATTE_LAMINATION,
        hasFlapWings: false,
      },
      interior: {
        pageCount: 100,
        paper: InteriorPaper.AVENA_80G,
        color: InteriorColor.C_1x1,
      },
      binding: BindingType.PAPERBACK,
      hasShrinkWrap: false,
    },
    notes: "",
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        catalogCode: initialData.catalogCode,
        title: initialData.title || "",
        author: initialData.author,
        clientId: initialData.clientId,
        budgetId: initialData.budgetId,
        specifications: initialData.specifications || formData.specifications,
        notes: initialData.notes,
        tags: initialData.tags,
      });
    } else if (isOpen) {
      // Reset para defaults
      setFormData({
        title: "",
        author: "",
        specifications: {
          format: BookFormat.F_A4,
          cover: {
            paper: CoverPaper.TRILEX_330G,
            color: CoverColor.C_4x0,
            finishing: FinishingType.MATTE_LAMINATION,
            hasFlapWings: false,
          },
          interior: {
            pageCount: 100,
            paper: InteriorPaper.AVENA_80G,
            color: InteriorColor.C_1x1,
          },
          binding: BindingType.PAPERBACK,
          hasShrinkWrap: false,
        },
        notes: "",
        tags: [],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (
      !formData.specifications?.interior.pageCount ||
      formData.specifications.interior.pageCount <= 0
    ) {
      newErrors.pages = "Número de páginas deve ser maior que zero";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  // ✅ Helper para update aninhado
  const updateSpecification = (path: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications!,
        ...setNestedValue(prev.specifications!, path, value),
      },
    }));
  };

  // Helper para setar valores aninhados
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return result;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Título do Livro *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: História Infantil Ilustrada"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Autor</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do autor"
                />
              </div>
            </div>
          </div>

          {/* Especificações Técnicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Especificações Técnicas</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Formato */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Formato *</label>
                <select
                  value={formData.specifications?.format}
                  onChange={(e) => updateSpecification("format", e.target.value as BookFormat)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Páginas */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Número de Páginas *
                </label>
                <input
                  type="number"
                  value={formData.specifications?.interior.pageCount}
                  onChange={(e) =>
                    updateSpecification("interior.pageCount", parseInt(e.target.value) || 0)
                  }
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.pages ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="100"
                />
                {errors.pages && <p className="mt-1 text-xs text-red-500">{errors.pages}</p>}
              </div>

              {/* Encadernação */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Encadernação *
                </label>
                <select
                  value={formData.specifications?.binding}
                  onChange={(e) => updateSpecification("binding", e.target.value as BindingType)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {BINDING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Miolo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Miolo</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Papel Miolo *
                </label>
                <select
                  value={formData.specifications?.interior.paper}
                  onChange={(e) =>
                    updateSpecification("interior.paper", e.target.value as InteriorPaper)
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {PAPER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cor Miolo *</label>
                <select
                  value={formData.specifications?.interior.color}
                  onChange={(e) =>
                    updateSpecification("interior.color", e.target.value as InteriorColor)
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {INTERIOR_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Capa */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Capa</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Papel Capa *</label>
                <select
                  value={formData.specifications?.cover.paper}
                  onChange={(e) => updateSpecification("cover.paper", e.target.value as CoverPaper)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {COVER_PAPER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cor Capa *</label>
                <select
                  value={formData.specifications?.cover.color}
                  onChange={(e) => updateSpecification("cover.color", e.target.value as CoverColor)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {COVER_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Acabamento Capa *
                </label>
                <select
                  value={formData.specifications?.cover.finishing}
                  onChange={(e) =>
                    updateSpecification("cover.finishing", e.target.value as FinishingType)
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {FINISHING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Extras</h3>

            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.specifications?.cover.hasFlapWings}
                  onChange={(e) => updateSpecification("cover.hasFlapWings", e.target.checked)}
                  className="mr-2"
                />
                Orelhas
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.specifications?.hasShrinkWrap}
                  onChange={(e) => updateSpecification("hasShrinkWrap", e.target.checked)}
                  className="mr-2"
                />
                Shrink Wrap
              </label>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Informações adicionais sobre o livro..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Salvar Livro
            </button>
          </div>
        </form>
      </div>
      export default BookCard;
    </div>
  );
}
