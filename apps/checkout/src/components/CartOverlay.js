import { X } from 'lucide-react';
import { Button } from '@org/components';
import { useCart } from '@org/checkout-provider';
import { Link } from 'react-router-dom';

export const CartOverlay = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute flex flex-col justify-between right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out transform translate-x-0">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close cart</span>
            </Button>
          </div>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <div id="cart-contents">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <Button className="w-full" asChild>
            <Link to="/checkout">To checkout</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;