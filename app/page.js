'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Stack, TextField, Button, Modal } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  // State to hold the list of inventory items (initially empty array)
  const [inventory, setInventory] = useState([]);
  // State to manage whether the inventory management UI is open or closed (initially false)
  const [open, setOpen] = useState(false);
  // State to store the name of the item being managed (initially an empty string)
  const [itemName, setItemName] = useState('');

  // Async function to fetch and update the inventory items from Firestore
  const updateInventory = async () => {
    // Set up a query to fetch all documents from the 'inventory' collection in Firestore
    const snapshot = query(collection(firestore, 'inventory'));
    // Wait for the query to complete and get the documents
    const docs = await getDocs(snapshot);
    // Initialize an empty array to store inventory data
    const inventoryList = [];
    // Loop through each document and add its data to the inventory list
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, // Use the document ID as the name
        ...doc.data(), // Include all the details from the document into the new object
      });
    });
    
    // Update the state with the fetched inventory list
    setInventory(inventoryList);
    console.log(inventoryList);
  }

  // Function to add a new item or increment its quantity
  const addItem = async (item) => {
    // Ensure the item name is valid
    if (!item || item.trim() === '') return;

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // Get the quantity from the document data
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    // Update the inventory
    await updateInventory();
  }

  // Function to remove an item or decrement its quantity
  const removeItem = async (item) => {
    // Ensure the item name is valid
    if (!item || item.trim() === '') return;

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    // Update the inventory
    await updateInventory();
  }

  // Fetch and update inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  // Function to open the modal
  const handleOpen = () => setOpen(true);
  // Function to close the modal
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {/* Modal for adding new items */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Button to open the modal */}
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      {/* Display of inventory items */}
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
