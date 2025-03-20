import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../components/Header';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    // Lấy dữ liệu từ file JSON
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setProducts(data.products);
      });
  }, []);

  // Lấy 6 sản phẩm theo category
  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => product.categoryId === categoryId).slice(0, 6);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  return (
    <>
      {!isLoggedIn && <Header />}

      <div className="container py-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">{category.name}</h4>
              <Link to={`/category/${category.id}`} className="text-primary">Xem thêm</Link>
            </div>
            <Row>
              {getProductsByCategory(category.id).map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: '180px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                    />
                    <Card.Body className="p-2 d-flex flex-column">
                      <Card.Title className="fs-6 text-truncate">
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                      </Card.Title>
                      <Card.Text className="small text-muted flex-grow-1" style={{ minHeight: '36px', overflow: 'hidden' }}>
                        {product.description}
                      </Card.Text>
                      <div className="fw-bold text-primary mb-2">{product.price.toLocaleString()} VND</div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleAddToCart(product)}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </>
  );
}
