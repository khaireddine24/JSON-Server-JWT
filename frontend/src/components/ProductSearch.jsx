import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

const ProductSearch = ({ onSearchChange, categories }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by product name..."
                onChange={(e) => onSearchChange('name', e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Maximum Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                placeholder="Enter max price..."
                onChange={(e) => onSearchChange('price', e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                onChange={(e) => onSearchChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductSearch;