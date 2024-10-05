import React from 'react';
import { Button } from '@org/components';
import { Link } from 'react-router-dom';

import { Header } from '@org/header';
import { trackClick } from 'analytics';

// @ts-expect-error - js apps are not type-checked
const CartOverlay = React.lazy(() => import('checkout/CartOverlay'));

const LandingPage = () => {
  const imgSrcBaseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:4202/' : '';

  return (
    <div className="flex flex-col min-h-screen">
      <Header showCart />
      <CartOverlay />
      <main className="flex-1">
        <section className="w-full">
          <img
            src={`${imgSrcBaseUrl}assets/orc_header.png`}
            width={1200}
            height={600}
            alt="Featured Products"
            className="w-full h-[60vh] object-cover"
          />
        </section>
        <section className="w-full py-6 md:py-12 lg:py-16">
          <div className="container px-3 md:px-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none pb-6 text-muted-foreground">
                  l'Orceal
                </h1>
                <p className="mx-auto max-w-[700px] md:text-xl italic">
                  Battle-tested beauty products for orcs.
                </p>
                <p className="mx-auto max-w-[700px] md:text-lg py-6 text-primary">
                  Made with ❤️ in{' '}
                  <span className="text-red-700	font-bold">Mordor</span>
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/products">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 py-1 text-sm dark:bg-gray-800">
                  Featured
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Quality Products
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our products are carefully curated to ensure the highest
                  quality for our customers.
                </p>
                <Button
                  onClick={() =>
                    trackClick({ app: 'discover', action: 'cta-click' })
                  }
                  asChild
                >
                  <Link to="/products">Explore Products</Link>
                </Button>
              </div>
              <div className="space-y-4 lg:col-span-2">
                <img
                  src={`${imgSrcBaseUrl}assets/product_range.png`}
                  width={800}
                  height={400}
                  alt="Featured Products"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  New Arrivals
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Check out our latest products, fresh off the shelves and ready
                  for you.
                </p>
                <Button asChild>
                  <Link to="/products">View New Arrivals</Link>
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Best Sellers
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover our most popular items loved by customers worldwide.
                </p>
                <Button asChild>
                  <Link to="/products">Shop Best Sellers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Join Our Community
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Subscribe to our newsletter for exclusive deals, new product
                  announcements, and more!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/#">Subscribe Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 E-commerce Store. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default function Component() {
  return <LandingPage />;
}
