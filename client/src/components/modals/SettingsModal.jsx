import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  Button,
  Modal,
  ModalOverlay,
  IconButton,
  ModalContent,
  useClipboard,
  ModalHeader,
  Text,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Tooltip,
  Input,
  useToast,
  Box,
  HStack,
  Divider,
  Center,
  VStack,
} from '@chakra-ui/react'
import { SettingsIcon, CopyIcon } from '@chakra-ui/icons'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { formatAddress } from '../../utils/formatMetamask'
import FetchCalendarInfo from '../Calendar/FetchCalendarInfo'
import FetchUserRole from '../Calendar/FetchUserRole'

const SettingsModal = ({ accountAddress, account, accountName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard('')

  const handleCopy = (value) => {
    onCopy(value)
  }
  const [transactionHash, setTransactionHash] = useState(null)
  const [contractAccountName, setContractAccountName] = useState('')
  const [contractCalendarAddress, setContractCalendarAddress] = useState('')
  const [inputName, setInputName] = useState()
  const defaultCalendar = CalendarDailyTelos.address
  const [inputCalendar, setInputCalendar] = useState(defaultCalendar)

  const handleNameChange = (event) => setInputName(event.target.value)
  const handleCalendarChange = (event) => setInputCalendar(event.target.value)

  const handleAccountName = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
      const transaction = await contract.setAccountName(inputName)
      await transaction.wait()
      setTransactionHash(transaction.hash)
      toast({
        title: 'Transaction successful',
        description: `New Account name: ${inputName}. Transaction hash: ${transaction.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const fetchAccountName = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, provider)
      const acctName = await contract.accountName()
      setContractAccountName(acctName)
    }
    fetchAccountName()
  }, [accountName])

  useEffect(() => {
    const handleCalendarAddress = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
      const calendar = await contract.calendarAddress()
      setContractCalendarAddress(calendar)
    }
    handleCalendarAddress()
  }, [contractCalendarAddress])

  const handleCalendarAddress = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
      const transaction = await contract.setCalendarAddress(inputCalendar)
      await transaction.wait()
      const calendar = await contract.calendarAddress()
      setContractCalendarAddress(calendar)
      setTransactionHash(transaction.hash)
      toast({
        title: 'Transaction successful',
        description: `Calendar Address: ${calendar}. Transaction hash: ${transaction.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const formattedTransactionHash = transactionHash ? `${transactionHash.slice(0, 12)}...${transactionHash.slice(-6)}` : null

  return (
    <>
      <IconButton bg="transparent" color="white" size="lg" onClick={onOpen} icon={<SettingsIcon />} />
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text as="b">Account Settings</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2} p={2}>
            <HStack w='100%'>
              <Text as="b" fontSize="14px">
                Account Name
              </Text>
              <Text>{accountName && (<>{accountName}</>)}</Text>
            </HStack>
            <Center  border='1px solid silver' bg='ghostwhite'>
            <Box  >
            <HStack spacing={'10px'} w={'100%'} bg={'ghostwhite'}>

              <Text as="b" fontSize="14px" mr={3}>
                Wallet:
              </Text>
              <Text bg='white' p={1} border='1px solid silver'  fontSize="14px">{formatAddress(account)}</Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy Wallet'}>
                <IconButton aria-label="Copy Wallet" icon={<CopyIcon />} size="sm" variant={'outline'} onClick={() => handleCopy(formatAddress(account))} />
              </Tooltip>
              <FetchUserRole address={account} />
            </HStack>
            <HStack spacing={'10px'} w={'100%'} bg={'ghostwhite'}>

              <Text as="b" fontSize="14px">
               Account:
              </Text>
              <Text bg='white' p={1} border='1px solid silver' fontSize="14px">{formatAddress(accountAddress)}</Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy Account'}>
                <IconButton
                  aria-label="Copy Account"
                  icon={<CopyIcon />}
                  variant={'outline'}
                  size="sm"
                  onClick={() => handleCopy(formatAddress(accountAddress))}
                />
              </Tooltip>
              <FetchUserRole address={accountAddress} />
            </HStack>
              
               
              

</Box>

</Center>
{/*
 <VStack border='0px solid silver' mt={4}>
                <HStack h="20px" mb={1}>
              <Text as="b" fontSize="14px">
                Calendar
              </Text>
              <Text bg='white' p={1} border='1px solid silver' fontSize="14px">{formatAddress(contractCalendarAddress)}</Text>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy Calendar Address'}>
                <IconButton
                  aria-label="Copy Calendar Address"
                  icon={<CopyIcon />}
                  size="sm"
                  
                  variant={'outline'}
                  onClick={() => handleCopy(formatAddress(contractCalendarAddress))}
                />
              </Tooltip>
</HStack>
            <FetchCalendarInfo calendarAddress={contractCalendarAddress} />
              
                </VStack>
                */}
            <Divider mt={2} />
            <FormControl>
              <FormLabel>Set Account Name</FormLabel>
              <HStack>
                <Input size={'sm'} type="text" value={inputName} onChange={handleNameChange} placeholder="Enter a public account name" />
                <Button size={'sm'} colorScheme="twitter" onClick={handleAccountName}>
                  Apply
                </Button>
              </HStack>
            </FormControl>
            <Divider mt={2} />

            <FormControl>
              <FormLabel>Set Default Calendar</FormLabel>
              <HStack>
                <Input size={'sm'} type="text" value={inputCalendar} onChange={handleCalendarChange} placeholder={`${defaultCalendar}`} />
                <Button size={'sm'} colorScheme="twitter" onClick={handleCalendarAddress}>
                  Apply
                </Button>
              </HStack>
            </FormControl>

            <Divider />

            {transactionHash && (
              <Box mt={3} bg="#edd5d3" p={2}>
                Transaction hash:{' '}
                <Text as="a" color="blue.500" href={`https://testnet.teloscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                  {formattedTransactionHash}
                </Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SettingsModal
