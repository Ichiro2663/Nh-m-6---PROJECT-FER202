import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Form, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);

        fetch('/database.json')
            .then(response => response.json())
            .then(data => {
                const foundProduct = data.products.find(p => p.id === parseInt(id));
                if (foundProduct) {
                    setProduct(foundProduct);
                    setQuantity(1);
                    setRelatedProducts(
                        data.products
                            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 6)
                    );
                }
                const randomBlogs = data.blogs.sort(() => 0.5 - Math.random()).slice(0, 2);
                setBlogs(randomBlogs);
            })
            .catch(error => console.error('Lỗi khi lấy dữ liệu sản phẩm:', error));
    }, [id]);

    const handleQuantityChange = (type) => {
        if (!product) return;

        setQuantity(prevQuantity => {
            if (type === 'increase' && prevQuantity < product.stock) {
                return prevQuantity + 1;
            } else if (type === 'decrease' && prevQuantity > 1) {
                return prevQuantity - 1;
            }
            return prevQuantity;
        });
    };

    const handleAction = (action) => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            console.log(`${action} ${quantity} sản phẩm: ${product.name}`);
        }
    };

    if (!product) return <p className="text-center mt-5">Đang tải...</p>;

    return (
        <>
            {!isLoggedIn && <Header />}

            <Container className="mt-5">
                <Row>
                    <Col md={3}>
                        <h4 className="fw-bold">Bài viết nổi bật</h4>
                        {blogs.map((blog) => (
                            <Card key={blog.id} className="mb-3 shadow-sm">
                                <Card.Img variant="top" src={blog.image} alt={blog.title} />
                                <Card.Body>
                                    <Card.Title className="text-truncate">{blog.title}</Card.Title>
                                    <Card.Text className="text-muted small">{blog.excerpt}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                    <Col md={4} className="d-flex justify-content-center">
                        <Image src={product.image} alt={product.name} fluid className="rounded shadow" style={{ maxWidth: '100%', height: '300px', objectFit: 'cover' }} />
                    </Col>
                    <Col md={5}>
                        <h2 className="fw-bold">{product.name}</h2>
                        <p className="text-muted">{product.description}</p>
                        <h4 className="text-primary">{product.price.toLocaleString()} VND</h4>
                        <div className="d-flex align-items-center my-3">
                            <Button variant="outline-dark" onClick={() => handleQuantityChange('decrease')}>-</Button>
                            <Form.Control className="mx-2 text-center" style={{ width: '50px' }} value={quantity} readOnly />
                            <Button variant="outline-dark" onClick={() => handleQuantityChange('increase')} disabled={quantity >= product.stock}>+</Button>
                        </div>
                        <Button className="me-2" variant="success" onClick={() => handleAction('Thêm vào giỏ hàng')}>Thêm vào giỏ hàng</Button>
                        <Button variant="danger" onClick={() => handleAction('Mua ngay')}>Mua ngay</Button>
                    </Col>
                </Row>
            </Container>
            
            <Container className="mt-5">
    <div className="d-flex justify-content-between align-items-center">
        <h4 className="fw-bold">Bạn có thể sẽ muốn mua thêm</h4>
        <Button variant="outline-success" onClick={() => navigate('/products')}>Xem thêm</Button>
    </div>
    <Row>
        {relatedProducts.map((product) => (
            <Col key={product.id} md={2} className="mb-3">
                <Card className="shadow-sm">
                    <Card.Img variant="top" src={product.image} alt={product.name} style={{ height: '150px', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Title className="text-truncate">
                            <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                        </Card.Title>
                        <Card.Text className="text-primary">{product.price.toLocaleString()} VND</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
</Container>
            
            <Footer />
        </>
    );
};

export default ProductDetail;
