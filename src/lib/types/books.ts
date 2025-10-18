// src/lib/types/books.ts
// Tipos para gerenciamento de projetos editoriais (livros)

import { Timestamp } from "firebase/firestore";

// ==================== ENUMS ====================

export enum ProjectCatalogType {
  BOOK = "L", // Livro
  EBOOK = "E", // E-book
  KINDLE = "K", // Kindle
  CD = "C", // CD
  DVD = "D", // DVD
  PRINTING = "G", // Gráfica
  PLATFORM = "P", // Plataforma
  SINGLE = "S", // Single
  THIRD_PARTY_BOOK = "X", // Livro Terceiros
  ART_DESIGN = "A", // Arte/Design
  CUSTOM = "CUSTOM", // Customizado
}

export enum BookFormat {
  F_140x210 = "140x210mm",
  F_160x230 = "160x230mm",
  F_A4 = "A4 (210x297mm)",
  CUSTOM = "Personalizado",
}

export enum InteriorPaper {
  AVENA_80G = "Avena 80g",
  POLEN_SOFT_80G = "Pólen Soft 80g",
  POLEN_BOLD_90G = "Pólen Bold 90g",
  COUCHE_115G = "Couché 115g",
  COUCHE_150G = "Couché 150g",
  OFFSET_90G = "Offset 90g",
  CUSTOM = "Personalizado",
}

export enum CoverPaper {
  TRILEX_330G = "Trilex 330g",
  SUPREMO_250G = "Supremo 250g",
  SUPREMO_350G = "Supremo 350g",
  COUCHE_250G = "Couché 250g",
  CUSTOM = "Personalizado",
}

export enum InteriorColor {
  C_1x1 = "1x1 cor",
  C_2x2 = "2x2 cores",
  C_4x4 = "4x4 cores",
  CUSTOM = "Personalizado",
}

export enum CoverColor {
  C_4x0 = "4x0 cor",
  C_4x1 = "4x1 cor",
  C_4x4 = "4x4 cores",
  CUSTOM = "Personalizado",
}

export enum BindingType {
  PAPERBACK = "Brochura",
  HARDCOVER = "Capa dura",
  SADDLE_STITCH = "Grampo canoa",
  SEWN = "Costura",
  CUSTOM = "Personalizado",
}

export enum FinishingType {
  MATTE_LAMINATION = "Laminação Fosca",
  MATTE_LAMINATION_SPOT_UV = "Laminação Fosca + Verniz com Reserva",
  GLOSS_LAMINATION = "Laminação Brilho",
  VARNISH = "Verniz",
  SPOT_VARNISH = "Verniz com Reserva",
  HOT_STAMPING = "Hot Stamping",
  CUSTOM = "Personalizado",
}

// ==================== INTERFACES ====================

export interface BookSpecifications {
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
}

export interface Book {
  id: string;
  clientId: string;
  catalogCode: string;
  catalogMetadata: {
    prefix: "DDM";
    type: ProjectCatalogType;
    clientNumber: number;
    workNumber: number;
  };
  title: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  specifications: BookSpecifications;
  referenceFiles?: {
    name: string;
    url: string;
    type: "pdf" | "mockup" | "artwork" | "other";
    uploadedAt: Timestamp;
  }[];
  notes?: string;
  clientName?: string;
  budgetId?: string;
  status?: "draft" | "in_production" | "completed" | "cancelled";
  dueDate?: Timestamp;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Gera código do catálogo DDM
 * @param type - Tipo do projeto (L, E, K, C, etc)
 * @param clientNumber - Número sequencial do cliente (ex: 456)
 * @param workNumber - Número do trabalho (1, 2, 3...)
 * @returns Código formatado (ex: "DDML0456" ou "DDML0456.1")
 */
export function generateCatalogCode(
  type: ProjectCatalogType,
  clientNumber: number,
  workNumber: number,
): string {
  const formattedClient = clientNumber.toString().padStart(4, "0");
  const base = `DDM${type}${formattedClient}`;

  if (workNumber === 1) {
    return base;
  }

  return `${base}.${workNumber - 1}`;
}

/**
 * Valida especificações do livro
 */
export function validateBookSpecifications(specs: BookSpecifications): string[] {
  const errors: string[] = [];

  if (specs.interior.pageCount < 1) {
    errors.push("Page count must be at least 1");
  }

  if (specs.interior.pageCount % 2 !== 0 && specs.binding === BindingType.SADDLE_STITCH) {
    errors.push("Saddle stitch binding requires even page count");
  }

  if (specs.format === BookFormat.CUSTOM && !specs.customFormat) {
    errors.push("Custom format requires format specification");
  }

  if (specs.cover.paper === CoverPaper.CUSTOM && !specs.cover.customPaper) {
    errors.push("Custom cover paper requires specification");
  }

  if (specs.interior.paper === InteriorPaper.CUSTOM && !specs.interior.customPaper) {
    errors.push("Custom interior paper requires specification");
  }

  return errors;
}
