import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@org/components';
import { useCart } from '@org/checkout-provider';
import { trackClick } from 'analytics';

type HeaderProps = {
  showCart?: boolean;
};

export function Header({ showCart }: HeaderProps = { showCart: true }) {
  const { totalPrice, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Products
          </Link>
        </nav>
        {showCart && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              Total: ${totalPrice.toFixed(2)}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                trackClick({
                  app: 'header',
                  action: 'cart-click',
                })
                return setIsCartOpen(true);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Open cart</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
