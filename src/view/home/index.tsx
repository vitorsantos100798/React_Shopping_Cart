import { useEffect, useState } from "react";
import api from "../../service/api";
import "./styles.css";
type Product = {
  id: number;
  name: string;
  units: number;
  price: string;
  image: string;
};

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/products");
      setProducts(response.data.products);
    };

    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.units += 1;
    } else {
      product.units = 1;
      updatedCart.push(product);
    }

    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const finalizePurchase = async () => {
    try {
      setIsLoading(true);

      const purchaseDetails = cart.map((item) => ({
        id: item.id,
        units: item.units,
      }));

      const response = await api.post("/purchases", {
        products: purchaseDetails,
      });
      if (response.status === 200) {
        alert("Compra finalizada com sucesso!");
        setCart([]);
      } else {
        console.error("Erro ao finalizar a compra:", response.data.error);
        alert(
          "Ocorreu um erro ao finalizar a compra. Tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      alert(
        "Ocorreu um erro ao finalizar a compra. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };
  console.log(products);
  return (
    <>
      <h1>Produtos</h1>
      <ul
        style={{
          display: "flex",
        }}
      >
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} width={180} height={120} />
            <p>{product.name}</p>
            <p>R$ {product.price}</p>
            <button onClick={() => addToCart(product)}>
              Adicionar ao Carrinho
            </button>
          </li>
        ))}
      </ul>

      <h1>Carrinho</h1>
      <ul>
        {cart.map((cartItem) => (
          <li key={cartItem.id}>
            <img src={cartItem.image} width={80} height={50} />
            {cartItem.name} - ${cartItem.price} - {cartItem.units} unidade{" "}
            <button onClick={() => removeFromCart(cartItem.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div className="container">
        {cart.length > 0 ? (
          <>
            <button className="buttonBottom" onClick={finalizePurchase}>
              {isLoading ? "Finalizando..." : "Finalizar Compra"}
            </button>
          </>
        ) : (
          false
        )}
      </div>
    </>
  );
};
