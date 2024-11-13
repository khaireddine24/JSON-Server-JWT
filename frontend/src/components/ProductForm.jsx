import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';
import axios from "axios";

const CATEGORIES = [
  "Computers",
  "Printers",
  "Smartphones",
  "Others"
];

const ProductForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product ? product.name : "",
    brand: product ? product.brand : "",
    category: product ? product.category : "Computers",
    price: product ? product.price : 0,
    description: product ? product.description : ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        description: formData.description
      };

      if (product) {
        await axios.put(
          `http://localhost:3004/products/${product.id}`, 
          dataToSubmit
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:3004/products", 
          dataToSubmit
        );
        toast.success("Product created successfully");
      }
      
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product. Please try again.');
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{product ? "Edit Product" : "Add Product"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {product ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductForm;