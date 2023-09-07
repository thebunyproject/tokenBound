import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast
} from '@chakra-ui/react';

function UserKeyStorage({ provider, contractAddress }) {
  const [userAddress, setUserAddress] = useState('');
  const [username, setUsername] = useState('');
  const [encryptedKey, setEncryptedKey] = useState('');
  const toast = useToast();

  const addWallet = async () => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Ethereum provider not found",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, /* ABI here */, signer);

    try {
      const tx = await contract.addWallet(userAddress, username, encryptedKey);
      await tx.wait();

      toast({
        title: "Success",
        description: "Wallet added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>User Address</FormLabel>
        <Input
          placeholder="Enter Ethereum Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Encrypted Key</FormLabel>
        <Input
          placeholder="Enter Encrypted Key"
          value={encryptedKey}
          onChange={(e) => setEncryptedKey(e.target.value)}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={addWallet}>
        Add Wallet
      </Button>
    </VStack>
  );
}

export default UserKeyStorage;
