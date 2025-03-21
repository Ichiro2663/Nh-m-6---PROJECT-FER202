import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // Simulate sending a reset password email (replace with your actual logic)
            const response = await axios.post('http://localhost:9999/forget-password', { email }); //  Endpoint

            if (response.status === 200) {
                setMessage('Một email khôi phục mật khẩu đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến.');
                setEmail(''); // Clear the email input after success
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Email không tồn tại trong hệ thống.');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
            console.error('Lỗi:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>Quên mật khẩu</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                        </Button>
                    </Form>
                    {message && <p className="text-success mt-3">{message}</p>}
                    {error && <p className="text-danger mt-3">{error}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default ForgetPassword;
