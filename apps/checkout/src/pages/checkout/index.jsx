import { Link } from 'react-router-dom';

import { Header } from '@org/header';

import { Button } from '@org/components';
import { Input } from '@org/components';
import { Label } from '@org/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@org/components';
import { Separator } from '@org/components';
import { CreditCard, Truck } from 'lucide-react';
import { useCart } from '@org/checkout-provider';
import { logger } from '@org/logger';
import { useEffect } from 'react';

const ProductsPage = () => {
  const imgSrcBaseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4202/'
      : '';

  const cart = useCart();

  useEffect(() => {
    logger('Checkout page loaded');
  }, []);
  const subtotal = cart.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter mb-8 text-primary-foreground">
            Checkout (js)
          </h1>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Shipping Information
                </h2>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-secondary text-secondary-foreground"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      type="email"
                      className="bg-secondary text-secondary-foreground"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      className="bg-secondary text-secondary-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        className="bg-secondary text-secondary-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        className="bg-secondary text-secondary-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger
                        id="country"
                        className="bg-secondary text-secondary-foreground"
                      >
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Payment Information
                </h2>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      className="bg-secondary text-secondary-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="bg-secondary text-secondary-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        className="bg-secondary text-secondary-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Order Summary
                </h2>
                <div className="border border-border rounded-lg p-4 bg-card text-card-foreground">
                  {cart.cart.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => {
                logger('Order placed', 'info');
                // Fake handling payment
              }}>
                <CreditCard className="mr-2 h-4 w-4" /> Place Order
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Truck className="inline-block mr-2 h-4 w-4" />
                Free shipping on orders over $50
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-border bg-muted">
        <div className="container flex flex-col sm:flex-row justify-between items-center py-6 px-4 md:px-6">
          <p className="text-xs text-muted-foreground">
            © 2024 L'Orceal. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link
              className="text-xs text-muted-foreground hover:text-primary"
              to="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs text-muted-foreground hover:text-primary"
              to="#"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default function Component() {
  return <ProductsPage />;
}
