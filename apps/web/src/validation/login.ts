import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Endereço de e-mail inválido' })
    .email('Endereço de e-mail inválido'),
  password: z
    .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
});

export type ILogin = z.infer<typeof loginSchema>;
