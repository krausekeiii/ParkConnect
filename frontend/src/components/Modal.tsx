import React from 'react';
import './Modal.css';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignupClick = () => {
    onClose();
    navigate('/volunteer-signup');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <p>{content}</p>
        <button className="signup-button" onClick={handleSignupClick}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Modal;
