import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: 'Preencha seu nome de usuário' })
      .min(5, 'Preencha seu nome de usuário')
      .max(40, 'Preencha seu nome de usuário')
      .regex(/[A-Za-z0-9_]+/, 'Nome de usuário inválido'),
    email: z
      .string({ required_error: 'Endereço de e-mail inválido' })
      .email('Endereço de e-mail inválido'),
    password: z
      .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
      .min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirm_password: z
      .string({
        required_error: 'Confirmação de senha deve ter ao menos 6 caracteres',
      })
      .min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas devem ser iguais',
    path: ['confirm_password'],
  });

export type IRegister = z.infer<typeof registerSchema>;
