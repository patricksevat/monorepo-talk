import React, { useEffect } from 'react';
import { Button } from '@org/components';
import { Link } from 'react-router-dom';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@org/components';

import { Header } from '@org/header';
import { useCart } from '@org/checkout-provider';
import { logger } from '@org/logger';

// @ts-expect-error - js apps are not type-checked
const CartOverlay = React.lazy(() => import('checkout/CartOverlay'));

// Mock product data
const products = [
  {
    id: 1,
    name: 'Styling hair gel for men',
    category: 'hair styling',
    price: 12.99,
    image: 'product_8.png',
  },
  {
    id: 2,
    name: 'Volumizing Shampoo',
    category: 'shampoo',
    price: 14.99,
    image: 'product_5.png',
  },
  {
    id: 3,
    name: 'Moisturizing Conditioner',
    category: 'shampoo',
    price: 12.99,
    image: 'product_6.png',
  },
  {
    id: 4,
    name: 'Sunscreen for children (UPF-50)',
    category: 'sun protection',
    price: 24.99,
    image: 'product_9.png',
  },
  {
    id: 5,
    name: 'Mouthwash',
    category: 'dental hygiene',
    price: 19.99,
    image: 'product_10.png',
  },
  {
    id: 6,
    name: 'Eyeshadow Palette',
    category: 'make-up',
    price: 34.99,
    image: 'product_7.png',
  },
  {
    id: 7,
    name: 'Toothpaste',
    category: 'shampoo',
    price: 11.99,
    image: 'product_11.png',
  },
  {
    id: 8,
    name: 'Mascara',
    category: 'make-up',
    price: 15.99,
    image: 'product_12.png',
  },
];

const ProductsPage = () => {
  const imgSrcBaseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:4202/' : '';

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const cart = useCart();

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;
    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }
    switch (sort) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [category, sort]);

  useEffect(() => {
    logger('Products page loaded', 'info');
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header showCart />
      <CartOverlay />
      <main className="flex-1">
        <section className="w-full">
          <img
            src={`${imgSrcBaseUrl}assets/female_orc.png`}
            width={1200}
            height={600}
            alt="Featured Products"
            className="w-full h-[55vh] object-cover"
          />
        </section>
        <section className="w-full py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold tracking-tighter mb-4 md:mb-0">
                Our Products
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  onValueChange={(value: string) => {
                    logger(`Filtering products by category: ${value}`, 'info');
                    return setCategory(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="shampoo">Shampoo</SelectItem>
                    <SelectItem value="make-up">Make-up</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value: string) => {
                    logger(`Sorting products by ${value}`, 'info');
                    return setSort(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price-asc">
                      Price (Low to High)
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price (High to Low)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 flex flex-col"
                >
                  <img
                    src={`${imgSrcBaseUrl}assets/${product.image}`}
                    width={200}
                    height={200}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600 mb-2">{product.category}</p>
                  <p className="text-lg font-bold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button
                    className="mt-auto"
                    onClick={() => cart.addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
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
  return <ProductsPage />;
}
