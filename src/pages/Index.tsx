import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Швейцарские часы Heritage',
    price: 485000,
    image: 'https://cdn.poehali.dev/projects/4485c454-d343-4ff0-8f3b-3aeac6ac7b31/files/e551893c-8ed8-41fa-8a54-f9e9bcf64d2e.jpg',
    description: 'Элегантные часы с автоматическим механизмом',
    category: 'Часы'
  },
  {
    id: 2,
    name: 'Бриллиантовое колье',
    price: 1250000,
    image: 'https://cdn.poehali.dev/projects/4485c454-d343-4ff0-8f3b-3aeac6ac7b31/files/60675718-7b9f-4e72-ad9e-d56c72ae57e3.jpg',
    description: 'Изысканное колье с натуральными бриллиантами',
    category: 'Украшения'
  },
  {
    id: 3,
    name: 'Сумка из итальянской кожи',
    price: 320000,
    image: 'https://cdn.poehali.dev/projects/4485c454-d343-4ff0-8f3b-3aeac6ac7b31/files/f0c63d76-e002-495f-b3b4-549cf53afe29.jpg',
    description: 'Роскошная сумка ручной работы из премиальной кожи',
    category: 'Аксессуары'
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success('Товар добавлен в корзину');
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.success('Товар удален из корзины');
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
    setCart([]);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsCheckout(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">ÉLÉGANCE</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10">
                <Icon name="ShoppingBag" size={24} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
                  <Icon name="ShoppingBag" size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">Корзина пуста</p>
                </div>
              ) : isCheckout ? (
                <form onSubmit={handleCheckout} className="mt-8 space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span>{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsCheckout(false)}
                    >
                      Назад к корзине
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-8">
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.price.toLocaleString('ru-RU')} ₽
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 ml-auto text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Итого:</span>
                      <span>{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setIsCheckout(true)}
                    >
                      Перейти к оформлению
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNm0wLTJjLTQuNDE4IDAtOCAzLjU4Mi04IDhzMy41ODIgOCA4IDggOC0zLjU4MiA4LTgtMy41ODItOC04LTh6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center z-10 animate-fade-in">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Роскошь в каждой детали
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Эксклюзивная коллекция премиальных товаров для истинных ценителей
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Перейти к каталогу
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-20 container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 animate-fade-in">
          Наша коллекция
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <Button
                    onClick={() => addToCart(product)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">ÉLÉGANCE</h3>
          <p className="text-primary-foreground/80 mb-6">
            Премиальные товары для тех, кто ценит качество
          </p>
          <div className="flex justify-center gap-6">
            <Icon name="Instagram" size={24} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Icon name="Facebook" size={24} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Icon name="Mail" size={24} className="cursor-pointer hover:opacity-70 transition-opacity" />
          </div>
          <p className="text-sm text-primary-foreground/60 mt-8">
            © 2024 ÉLÉGANCE. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
