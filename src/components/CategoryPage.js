import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import Header from '../components/Header';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    // Lấy dữ liệu từ file JSON
    const fetchData = async () => {
      try {
        const res = await fetch('/database.json');
        const db = await res.json();
        const cat = db.categories.find((c) => c.id === parseInt(id));
        const prods = db.products.filter((p) => p.categoryId === parseInt(id));
        setCategory(cat);
        setProducts(prods);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!category) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <>
      {/* Chỉ hiển thị Header nếu chưa đăng nhập */}
      {!isLoggedIn && <Header />}

      <Container className="py-4">
        <h2 className="fw-bold mb-4">{category.name}</h2>
        
        {products.length === 0 ? (
          <p className="text-center text-muted">Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.name} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate">
                      <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                    </Card.Title>
                    <Card.Text className="text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
                      {product.description}
                    </Card.Text>
                    <Card.Text className="fw-bold text-primary">{product.price.toLocaleString()} VND</Card.Text>
                    <Button variant="primary" className="w-100 mt-auto">Thêm vào giỏ</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
