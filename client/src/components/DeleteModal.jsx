import './deleteModal.css';

import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm();
        onClose();
      };
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this article?</p>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleConfirm}>Delete</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteModal;