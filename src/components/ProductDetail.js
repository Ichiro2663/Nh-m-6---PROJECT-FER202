import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Form } from 'react-bootstrap';
import Header from '../components/Header'; // Import Header

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ localStorage
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);

        // Lấy dữ liệu sản phẩm từ file JSON
        fetch('/database.json')
            .then(response => response.json())
            .then(data => {
                const foundProduct = data.products.find(p => p.id === parseInt(id));
                if (foundProduct) {
                    setProduct(foundProduct);
                    setQuantity(1);
                }
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
            {/* Chỉ hiển thị Header nếu chưa đăng nhập */}
            {!isLoggedIn && <Header />}

            <Container className="mt-5">
                <Row>
                    <Col md={6} className="d-flex justify-content-center">
                        <Image src={product.image} alt={product.name} fluid className="rounded shadow" />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold">{product.name}</h2>
                        <p className="text-muted">{product.description}</p>
                        <h4 className="text-primary">{product.price.toLocaleString()} VND</h4>
                        <div className="d-flex align-items-center my-3">
                            <Button variant="outline-primary" onClick={() => handleQuantityChange('decrease')}>-</Button>
                            <Form.Control className="mx-2 text-center" style={{ width: '50px' }} value={quantity} readOnly />
                            <Button variant="outline-primary" onClick={() => handleQuantityChange('increase')} disabled={quantity >= product.stock}>+</Button>
                        </div>
                        <Button className="me-2" variant="primary" onClick={() => handleAction('Thêm vào giỏ hàng')}>Thêm vào giỏ hàng</Button>
                        <Button variant="success" onClick={() => handleAction('Mua ngay')}>Mua ngay</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProductDetail;
