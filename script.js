const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // check for edit mode,
  // remove item from the local storage and the dom
  // add edited item to the storage and dom
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemtoStorage(newItem);

  itemInput.value = '';
  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  const icon = createIcon('fa-solid fa-xmark');

  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
}
function addItemtoStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(className) {
  const btn = document.createElement('button');
  btn.className = className;
  return btn;
}
function createIcon(className) {
  const icon = document.createElement('i');
  icon.className = className;
  return icon;
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement); // i>button>li
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove(); // remove from the DOM
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(itemName) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.splice(itemsFromStorage.indexOf(itemName), 1);
  // itemsFromStorage = itemsFromStorage.filter((item) => item !== itemName);

  // re-set local storage;
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // clear from storage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const filterText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.innerText.toLowerCase();
    if (!itemName.includes(filterText)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

/**
 * Check whether the list items is empty or not, to display
 * clear all button and filter input
 */
function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// initialize app
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
