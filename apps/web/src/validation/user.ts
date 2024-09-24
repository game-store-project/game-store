import { z } from 'zod';

export const usernameSchema = z.object({
  username: z
    .string({ required_error: 'Preencha seu nome de usuário' })
    .min(5, 'Nome de usuário deve ter ao menos 5 caracteres')
    .max(40, 'Nome de usuário deve ter no máximo 40 caracteres')
    .regex(/[A-Za-z0-9_]+/, 'Nome de usuário inválido'),
});

export type IUsername = z.infer<typeof usernameSchema>;

export const emailSchema = z.object({
  email: z
    .string({ required_error: 'Endereço de e-mail inválido' })
    .email('Endereço de e-mail inválido'),
  password: z
    .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
    .min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export type IEmail = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .object({
    password: z
      .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
      .min(6, 'Senha deve ter ao menos 6 caracteres'),
    new_password: z
      .string({ required_error: 'Senha nova deve ter ao menos 6 caracteres' })
      .min(6, 'Senha nova deve ter ao menos 6 caracteres'),
    confirm_password: z
      .string({
        required_error: 'Confirmação de senha deve ter ao menos 6 caracteres',
      })
      .min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'As senhas devem ser iguais',
    path: ['confirm_password'],
  });

export type IPassword = z.infer<typeof passwordSchema>;
