import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Collections.css';
import ConfirmationModal from './ConfirmationModal';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);  // Track which collection to delete

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/collections`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setCollections(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/collections/${collectionToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Collection deleted successfully!");
        setCollections(collections.filter(collection => collection._id !== collectionToDelete));
        setShowModal(false);
      } else {
        alert("Failed to delete the collection.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("An error occurred while trying to delete the collection.");
    }
  };

  const showConfirmationModal = (collectionId) => {
    setCollectionToDelete(collectionId);
    setShowModal(true);
  };

  const closeConfirmationModal = () => {
    setShowModal(false);
    setCollectionToDelete(null);
  };

  if (loading) return <p>Loading collections...</p>;

  return (
    <div className="collections-container">
      <h2>Your Collections</h2>
      {collections.length > 0 ? (
        <div className="collection-list">
          {collections.map((collection) => (
            <div key={collection._id} className="collection-card">
              <h3>{collection.collection_name}</h3>
              <p>{collection.description}</p>
              <p><strong>Visibility:</strong> {collection.visibility}</p>
              <button
                onClick={() => navigate(`/collections/${collection._id}`)}
                className="view-books-button"
              >
                View Books
              </button>
              <button
                onClick={() => showConfirmationModal(collection._id)}
                className="delete-collection-button"
              >
                Delete Collection
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No collections found. Create a new one!</p>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        showModal={showModal}
        onClose={closeConfirmationModal}
        onConfirm={handleDeleteCollection}
      />
    </div>
  );
};

export default Collections;
