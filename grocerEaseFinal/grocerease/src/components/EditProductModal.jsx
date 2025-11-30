import React from 'react';
import AddProductForm from './AddProductForm';

export default function EditProductModal({ product, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Edit Product</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <AddProductForm
          initial={product}
          onDone={() => { onSave(); onClose(); }}
        />
      </div>
    </div>
  );
}




