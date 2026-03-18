import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from './Modal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    content: null,
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    maxWidth: 'max-w-md'
  });

  const openModal = useCallback((config) => {
    setModalConfig({
      ...modalConfig,
      ...config,
      isOpen: true,
    });
  }, [modalConfig]);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        type={modalConfig.type}
        maxWidth={modalConfig.maxWidth}
      >
        {modalConfig.content}
      </Modal>
    </ModalContext.Provider>
  );
};

export default ModalContext;
