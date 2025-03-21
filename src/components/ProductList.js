import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [blogs, setBlogs] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceCategory, setPriceCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/database.json");
        const data = await res.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        const shuffledBlogs = data.blogs.sort(() => Math.random() - 0.5).slice(0, 2);
        setBlogs(shuffledBlogs);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products.filter((p) => {
      return (
        (!minPrice || p.price >= parseFloat(minPrice) * 1000) &&
        (!maxPrice || p.price <= parseFloat(maxPrice) * 1000)
      );
    });

    if (priceCategory) {
      switch (priceCategory) {
        case 'low':
          filtered = filtered.filter((p) => p.price < 20000);
          break;
        case 'medium':
          filtered = filtered.filter((p) => p.price >= 20000 && p.price <= 50000);
          break;
        case 'high':
          filtered = filtered.filter((p) => p.price > 50000 && p.price <= 100000);
          break;
        case 'premium':
          filtered = filtered.filter((p) => p.price > 100000);
          break;
        default:
          break;
      }
    }
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, priceCategory, products]);

  return (
    <>
      <Header />
      <Container className="py-4">
        <Row>
          {/* Bộ lọc giá bên trái */}
          <Col md={3}>
            <h4 className="fw-bold">Lọc theo giá</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Khoảng giá</Form.Label>
                <Form.Select value={priceCategory} onChange={(e) => setPriceCategory(e.target.value)}>
                  <option value="">Chọn phân loại giá</option>
                  <option value="low">Giá rẻ (Dưới 20.000đ)</option>
                  <option value="medium">Trung bình (20.000đ - 50.000đ)</option>
                  <option value="high">Cao cấp (50.000đ - 100.000đ)</option>
                  <option value="premium">Trên 100.000đ</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá tối thiểu (nghìn đồng)</Form.Label>
                <Form.Control
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá tối đa (nghìn đồng)</Form.Label>
                <Form.Control
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Nhập giá tối đa"
                />
              </Form.Group>
            </Form>
          </Col>

          {/* Danh sách sản phẩm ở giữa */}
          <Col md={6}>
            <h2 className="fw-bold mb-4">Danh sách sản phẩm</h2>
            <Row>
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      alt={product.name} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">{product.name}</Card.Title>
                      <Card.Text className="text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
                        {product.description}
                      </Card.Text>
                      <Card.Text className="fw-bold text-primary">{product.price.toLocaleString()} VND</Card.Text>
                      <Button 
                        variant="success" 
                        className="w-100 mt-auto"
                        onClick={() => navigate("/login")}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-4">
                <Button variant="success" onClick={() => setVisibleCount(visibleCount + 15)}>Xem thêm</Button>
              </div>
            )}
          </Col>

          {/* Bài viết bên phải */}
          <Col md={3}>
            <h4 className="fw-bold">Bài viết nổi bật</h4>
            {blogs.map((blog) => (
              <Card key={blog.id} className="mb-3 shadow-sm">
                <Card.Img variant="top" src={blog.image} alt={blog.title} style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="text-truncate">{blog.title}</Card.Title>
                  <Card.Text className="text-muted small">{blog.excerpt}</Card.Text>
                  <Button variant="link" onClick={() => navigate(blog.link)}>Đọc thêm</Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
