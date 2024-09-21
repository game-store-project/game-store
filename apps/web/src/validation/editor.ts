import { z } from 'zod';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const editorSchema = z.object({
  image: z
    .instanceof(FileList, { fatal: true, message: 'A imagem é obrigatória.' })
    .refine((files) => files?.length === 1, 'A imagem é obrigatória.')
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type as string),
      'A imagem deve ser do tipo JPEG, JPG, PNG ou WEBP',
    ),
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(1, 'O título é obrigatório'),
  year: z.coerce
    .number({ invalid_type_error: 'O ano é obrigatório' })
    .min(1900, 'O ano deve ser maior que 1900')
    .max(new Date().getFullYear(), 'O ano não pode ser maior que o ano atual'),
  price: z.coerce
    .number({
      invalid_type_error: 'O preço é obrigatório',
    })
    .min(0, 'O preço deve ser maior ou igual a zero'),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, 'A descrição é obrigatória'),
  genre: z
    .string({ required_error: 'O gênero é obrigatório' })
    .uuid('O gênero é obrigatório'),
  disponibility: z.boolean(),
});

export type IEditor = z.infer<typeof editorSchema>;
