import { collection, onSnapshot, enableIndexedDbPersistence, addDoc, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
// enable offline data
enableIndexedDbPersistence(db)
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

// Ensure the Firestore SDK is loaded correctly
// import { collection, onSnapshot, enablePersistence } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
document.addEventListener('DOMContentLoaded', function () {
    const db = window.db;
  
    // Make sure db is available
    if (db) {
      // Import the necessary functions to interact with the Firestore collection
      
  
      // Access Firestore collection 'recipes'
      const recipesRef = collection(db, 'recipes');
      
      // Listen to snapshot changes in the collection
      onSnapshot(recipesRef, (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id);
          }
          if(change.type === 'removed'){
            removeRecipe(change.doc.id)
          }
        });
      });
    } else {
      console.error('Firestore db not initialized');
    }
  }
)

// // add new recipe
// const form = document.querySelector('form');
// form.addEventListener('submit', evt => {
//   evt.preventDefault();
  
//   const recipe = {
//     name: form.title.value,
//     ingredients: form.ingredients.value
//   };

//   db.collection('recipes').add(recipe)
//     .catch(err => console.log(err));

//   form.title.value = '';
//   form.ingredients.value = '';
// });


// Add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', async evt => {
  evt.preventDefault();
  
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  try {
    // Add the new recipe to Firestore
    await addDoc(collection(db, 'recipes'), recipe);
  } catch (err) {
    console.error('Error adding document: ', err);
  }

  form.title.value = '';
  form.ingredients.value = '';
});

// delete recipe
// const recipeContainer = document.querySelector('.recipes')
// recipeContainer.addEventListener('click', evt =>{
//   if(evt.target.tagName === 'I'){
//     const id = evt.target.getAttribute('data-id')
//     db.collection('recipes').doc(id).delete()
//   }
// })


const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', async evt => {
  if (evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id');
    // Check if the ID is correctly retrieved
    console.log('ID to delete:', id);
    try {
      await deleteDoc(doc(db, 'recipes', id));
      console.log('Document successfully deleted');
    } catch (err) {
      console.error('Error deleting document: ', err);
    }
  }else {
    console.error('No valid ID found for deletion');
  }
});