import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const reportSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Descreva o problema com pelo menos 10 caracteres'),
  location: z.string().min(3, 'Informe a localização'),
  imageUrl: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReportInput = z.infer<typeof reportSchema>;

export const REPORT_STATUSES = {
  NA_FILA: { label: 'Na Fila', color: 'bg-gray-100 text-gray-700' },
  EM_TRIAGEM: { label: 'Em Triagem', color: 'bg-yellow-100 text-yellow-700' },
  EM_PROGRESSO: { label: 'Em Progresso', color: 'bg-blue-100 text-blue-700' },
  CONCLUIDO: { label: 'Concluído', color: 'bg-green-100 text-green-700' },
  NEGADO: { label: 'Negado', color: 'bg-red-100 text-red-700' },
} as const;

export const PRIORITIES = {
  BAIXA: { label: 'Baixa', color: 'bg-green-100 text-green-700' },
  MEDIA: { label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
  ALTA: { label: 'Alta', color: 'bg-red-100 text-red-700' },
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;
export type Priority = keyof typeof PRIORITIES;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  category: string | null;
  priority: Priority | null;
  technicalSummary: string | null;
  status: ReportStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
