'use client';

import { ICart } from '@/dtos/cart';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/utils/price';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';
import { Button } from './ui/button';
import { Loading } from './ui/loading';
import { toast } from 'sonner';

interface PaymentMethodProps extends ComponentProps<'input'> {
  checked: boolean;
  title: string;
  method: string;
  disabled: boolean;
}

const PaymentMethod = ({
  checked,
  title,
  method,
  disabled,
  ...props
}: PaymentMethodProps) => {
  return (
    <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
      <input
        className="accent-primary size-5"
        type="radio"
        name={method}
        checked={checked}
        disabled={disabled}
        readOnly
        {...props}
      />
      <span>{title}</span>
    </div>
  );
};

interface CartItemProps extends ICart {
  disabled?: boolean;
  onClick?: () => void;
}

const CartItem = ({ title, slug, price, imageUrl, disabled, onClick }: CartItemProps) => {
  return (
    <div className="bg-secondary flex justify-between gap-2 rounded-lg">
      <div className="flex items-center gap-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_API}/${imageUrl}`}
          className="w-20 rounded-l-lg sm:w-[130px]"
          quality={20}
          alt={slug}
          width={130}
          height={75}
        />
        <span className="text-sm sm:text-base">{title}</span>
      </div>
      <div className="mr-3 flex flex-col items-center justify-center">
        <span className="text-sm sm:text-base">{formatPrice(price)}</span>
        <button
          onClick={onClick}
          disabled={disabled}
          className="text-destructive hover:text-destructive/90 active:text-destructive/95 text-sm underline active:transition-none sm:text-base"
        >
          Remover
        </button>
      </div>
    </div>
  );
};

export const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState([
    { title: 'PIX', checked: false, method: 'pix', tax: 1 },
    { title: 'CARTÃO DE CRÉDITO', checked: false, method: 'debit-card', tax: 1.05 },
    { title: 'CARTÃO DE DÉBITO', checked: false, method: 'credit-card', tax: 1.02 },
    { title: 'BOLETO', checked: false, method: 'boleto', tax: 1.01 },
  ]);

  const { cartItems, buyCartItems, removeCartItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleSetPaymentMethod = (method: string) => {
    setMethod((prev) =>
      prev.map((item) => {
        if (item.method === method) {
          return { ...item, checked: true };
        }

        return { ...item, checked: false };
      }),
    );
  };

  const handleGetTotalPrice = (tax?: number) => {
    return cartItems.reduce((acc, item) => acc + item.price * (tax || 1), 0);
  };

  const handleGetTaxAndTotalPrice = () => {
    const tax = method.find((item) => item.checked)?.tax || 1;
    return handleGetTotalPrice(tax);
  };

  const handleSubmitBuy = async () => {
    setIsLoading(true);

    if (!user?.id) {
      toast.error('Você precisa estar logado para finalizar a compra.');
      router.push('/login');
      return;
    }

    await buyCartItems();

    router.push(`/me/${user?.username}`);

    setIsLoading(false);
  };

  return (
    <section className="mx-auto w-full max-w-[1260px] space-y-3 px-6 py-3">
      <h1 className="text-2xl font-bold">MEU CARRINHO</h1>
      <div className="flex flex-wrap gap-6 lg:flex-nowrap">
        <div className="bg-input flex max-h-[504px] w-full flex-col justify-between space-y-3 rounded-lg p-3 lg:w-[750px]">
          {cartItems.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <h2 className="text-lg">Seu carrinho está vazio!</h2>
            </div>
          ) : (
            <>
              <div className="space-y-3 px-1">
                <div className="flex justify-between">
                  <h2 className="font-semibold">PRODUTO</h2>
                  <h2 className="font-semibold">VALOR</h2>
                </div>
                <div className="max-h-[400px] space-y-3 overflow-y-auto p-1">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      disabled={isLoading}
                      onClick={() => removeCartItem(item.id)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between px-1">
                <h2 className="font-semibold">SUBTOTAL</h2>
                <h2 className="font-semibold">{formatPrice(handleGetTotalPrice())}</h2>
              </div>
            </>
          )}
        </div>

        <div className="w-full space-y-6 lg:max-w-[420px]">
          <div className="bg-input space-y-5 rounded-xl p-5">
            <h1 className="font-semibold">FORMAS DE PAGAMENTO</h1>
            <div className="space-y-3">
              {method.map((item) => (
                <PaymentMethod
                  key={item.method}
                  {...item}
                  disabled={isLoading || cartItems.length === 0}
                  onClick={() => handleSetPaymentMethod(item.method)}
                />
              ))}
            </div>
          </div>
          <div className="bg-input space-y-5 rounded-xl p-5">
            <div className="flex justify-between">
              <h2 className="font-semibold">VALOR TOTAL</h2>
              <h2 className="font-bold">{formatPrice(handleGetTaxAndTotalPrice())}</h2>
            </div>
            <Button
              className="w-full"
              onClick={handleSubmitBuy}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? <Loading variant="small" size="button" /> : 'FINALIZAR COMPRA'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
