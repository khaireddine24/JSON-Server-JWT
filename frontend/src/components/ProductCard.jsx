import React from "react";
import { Card, Button } from "react-bootstrap";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{product.brand}</Card.Subtitle>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>Price: {product.price} TND</Card.Text>
        <div className="d-grid gap-2">
        <Button variant="primary" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button variant="danger" className="ml-5" onClick={() => onDelete(product.id)}>
          Delete
        </Button>
        </div>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Category: {product.category}</small>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
