import { Button, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Text, useToast, Box, HStack, Tooltip } from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json';

const DepositForm = ({accountAddress, accountBalance, accountName, account}) => {
  const toast = useToast();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [depositEvent, setDepositEvent] = useState(null);

  const handleAmountChange = (event) => setAmount(event.target.value);

  const handleDeposit = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer);
      const transaction = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      await transaction.wait();
      setTransactionHash(transaction.hash);
      toast({
        title: "Transaction successful",
        description: `Deposited ${amount} ETH. Transaction hash: ${transaction.hash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer);
      setContract(contractInstance);
    }
  }, [provider]);

  useEffect(() => {
    if (contract) {
      contract.on("NewDeposit", (depositor, amount) => {
        const eventDescription = `Address ${depositor} deposited ${ethers.utils.formatEther(amount)} WTLOS`;
        setDepositEvent(eventDescription);
        toast({
          title: "New deposit",
          description: eventDescription,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      });
    }

    return () => {
      if (contract) {
        contract.removeAllListeners("NewDeposit");
      }
    };
  }, [contract]);

  return (
    <div>
<Text fontSize={'16px'} as='b'>Deposit</Text>
<HStack>

<Text as={"b"} fontSize="12px">Account:</Text>
<Tooltip label={accountAddress} fontSize='12px'>

      <Text >{accountName}</Text>
</Tooltip>
</HStack>
     <FormControl borderTop="1px solid #b77672" w="100%">
  
  <HStack mt={-1} bg="#edd5d3" mb={1}>
    <Text >
      TLOS Balance:
    </Text>
    <Text >{accountBalance}</Text>
  </HStack>
  <NumberInput w={100} defaultValue={0} min={0} precision={2} step={0.01} onChange={valueString => setAmount(valueString)}>
    <NumberInputField placeholder="Enter amount in TLOS" />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>

      
      <Button colorScheme="twitter" size="md" mt={2} w="225px" onClick={handleDeposit}>Deposit</Button>
      {transactionHash && <Box mt={3}>Transaction hash: {transactionHash}</Box>}
      {depositEvent && <Box mt={3}>Last Deposit Event: {depositEvent}</Box>}
    </div>
  );
};

export default DepositForm;
