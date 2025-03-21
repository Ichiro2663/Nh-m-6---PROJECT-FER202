import React, { useState } from 'react'; // Changed to useState
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = (props) => { // Changed to functional component
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const emailCheckResponse = await axios.get(`http://localhost:9999/users?email=${email}`);
            if (emailCheckResponse.data.length > 0) {
                setError('Email đã tồn tại.');
                return;
            }

            // Get the latest user id
            const usersResponse = await axios.get('http://localhost:9999/users');
            const users = usersResponse.data;
            const lastUser = users[users.length - 1];
            const nextId = lastUser ? (parseInt(lastUser.id) + 1).toString() : "1";

            // Create new user
            const newUser = {
                id: nextId,
                name: name,
                email: email,
                password: password,
                role: 'customer',
            };

            await axios.post('http://localhost:9999/users', newUser);
            setSuccess(true); // set success to true
            setError('');

        } catch (err) {
            console.error('Lỗi khi đăng ký:', err);
            setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>Đăng ký</h2>
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">Đăng ký thành công!</p>} {/* show success message */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

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

                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Đăng ký
                        </Button>
                    </Form>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/login')}
                        className="mt-2"
                    >
                        Login
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
