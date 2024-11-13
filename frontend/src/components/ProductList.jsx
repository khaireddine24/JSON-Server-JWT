import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Row, Col, Modal } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import ProductSearch from "./ProductSearch";
import { Plus } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchCriteria]);

  const fetchProducts = () => {
    axios
      .get("http://localhost:3004/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Error in fetch");
      });
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchCriteria.name) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchCriteria.name.toLowerCase())
      );
    }

    if (searchCriteria.price) {
      filtered = filtered.filter(product =>
        product.price <= parseFloat(searchCriteria.price)
      );
    }

    if (searchCriteria.category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === searchCriteria.category.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearchChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = [...new Set(products.map(product => product.category))];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (product) => {
    if (!product || !product.id) {
      toast.error("Invalid product data");
      return;
    }
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || !productToDelete.id) {
      toast.error("Invalid product data");
      setShowDeleteDialog(false);
      setProductToDelete(null);
      return;
    }

    try {
      await axios.delete(`http://localhost:3004/products/${productToDelete.id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = () => {
    fetchProducts();
    setShowForm(false);
  };

  return (
    <Container className="mt-5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Button variant="success" className="mb-4" onClick={handleAddProduct}>
        <Plus/>
      </Button>

      <ProductSearch 
        onSearchChange={handleSearchChange}
        categories={categories}
      />

      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.id} md={4}>
            <ProductCard
              product={product} 
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteClick(product)}
            />
          </Col>
        ))}
      </Row>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      <Modal 
        show={showDeleteDialog} 
        onHide={() => setShowDeleteDialog(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
          {productToDelete && (
            <p className="mt-2">
              <strong>{productToDelete.name}</strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteDialog(false);
              setProductToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;