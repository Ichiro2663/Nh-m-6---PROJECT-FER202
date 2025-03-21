import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9999/users');
                setUsers(response.data);
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', err);
                setError('Lỗi khi lấy dữ liệu người dùng.');
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const user = users.find((u) => u.email === email && u.password === password); // Cần mã hóa mật khẩu

        if (user) {
            setError('');
            onLogin(user);
            navigate('/HomePage');
        } else {
            setError('Email hoặc mật khẩu không đúng.');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>Đăng nhập</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button variant="primary" type="submit">
                                Đăng nhập
                            </Button>
                            <Button variant="secondary" onClick={handleRegisterClick}>
                                Đăng ký
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
