<template>
    <div class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this product?</p>
        <button @click="$emit('confirm')">Yes</button>
        <button @click="$emit('close')">No</button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  