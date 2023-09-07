import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  IconButton,
  HStack,
  Text,
  Input,
  Button,
  Box,
  useClipboard,
  useToast,
  VStack,
  Center,
  Tooltip,
} from '@chakra-ui/react'
import { SettingsIcon, CopyIcon } from '@chakra-ui/icons'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import React, { useState, useContext, useEffect } from 'react'
import { ethers } from 'ethers'
import { useDisclosure } from '@chakra-ui/react'
import { DrawerBody } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import { StackDivider, Heading, Stack, Card, CardHeader, CardBody } from '@chakra-ui/react'
import { formatAddress } from '../../utils/formatMetamask'

const SettingsDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { account, logged, accountAddress } = useContext(AppContext)
  const [transactionHash, setTransactionHash] = useState(null)
  const { onCopy } = useClipboard(account)
  const [contractAccountName, setContractAccountName] = useState('')
  const [contractCalendarAddress, setContractCalendarAddress] = useState('')
  const [inputName, setInputName] = useState()
  const defaultCalendar = CalendarDailyTelos.address
  const [inputCalendar, setInputCalendar] = useState(defaultCalendar)

  useEffect(() => {
    // code
    onFontColorChange(fontColor)
  }, [backgroundColor, onFontColorChange])

  useEffect(() => {
    if (backgroundColor === '#303171') {
      setFontColor('white')
      onFontColorChange('white')
    } else if (backgroundColor === '#32a9e2') {
      setFontColor('white')
      onFontColorChange('white')
      // Blue #1
    } else if (backgroundColor === '#a6d8ef') {
      setFontColor('black')
      onFontColorChange('black')
      // Purple #2
    } else if (backgroundColor === '#474973') {
      setFontColor('white')
      onFontColorChange('white')
    } else if (backgroundColor === '#345aa0') {
      setFontColor('white')
      onFontColorChange('white')
      // pink
    } else if (backgroundColor === '#ef476f') {
      setFontColor('white')
      onFontColorChange('white')
      // Blue #5
    } else if (backgroundColor === '#073b4c') {
      setFontColor('white')
      onFontColorChange('white')
      // Blue #6
    } else if (backgroundColor === '#1DA1F2') {
      setFontColor('#14171A')
      onFontColorChange('#14171A')
      // Purple #1
    } else if (backgroundColor === '#a69cac') {
      setFontColor('white')
      onFontColorChange('white')
      // Yellow #1
    } else if (backgroundColor === '#ffd166') {
      setFontColor('black')
      onFontColorChange('black')
      // Green #1
    } else if (backgroundColor === '#06d6a0') {
      setFontColor('black')
      onFontColorChange('black')
    } else {
      setFontColor('black')
    }
  }, [backgroundColor])

  const handleNameChange = (event) => setInputName(event.target.value)
  const handleCalendarChange = (event) => setInputCalendar(event.target.value)
  const [calendarError, setCalendarError] = useState()
  const handleAccountName = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
      const transaction = await contract.setAccountName(inputName)
      await transaction.wait()
      const acctName = await contract.accountName()
      setContractAccountName(acctName)
      setTransactionHash(transaction.hash)
      toast({
        title: 'Transaction successful',
        description: `New Account name: ${acctName}. Transaction hash: ${transaction.hash}`,
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
    const handleCalendarAddress = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
        const calendar = await contract.calendarAddress()
        setContractCalendarAddress(calendar)
      } catch (error) {
        console.error('Error fetching calendar address:', error)
        // Optionally, you can also set a state to handle the error in the UI if needed
        setCalendarError(true)
      }
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

  const handleCopyToClipboard = () => {
    onCopy() // Trigger the clipboard copy action
    toast({
      title: 'Address Copied',
      description: 'The address has been copied to the clipboard.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
                                <Tooltip label="Open Settings" placement="top">

      <IconButton bg="transparent" color="black" size="lg" onClick={onOpen} icon={<SettingsIcon />} />
      </Tooltip>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid silver">
            <Text as="b">Settings</Text>
          </DrawerHeader>
          <DrawerBody pb={1} p={1} bg="ghostwhite">
            <Card>
              <CardHeader>
                <Heading size="md">Profile</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Profile Account Address
                    </Heading>
                    <HStack>
                      {accountAddress ? (
                        <>
                          <Text fontSize="14px">{formatAddress(accountAddress)}</Text>
                        </>
                      ) : (
                        <>
                          <HStack w="full">
                            <Text textAlign={'left'}>No account address found...</Text>
                            <Button ml={6} colorScheme="twitter" size="sm">
                              Create Profile
                            </Button>
                          </HStack>
                        </>
                      )}
                    </HStack>
                  </Box>
                  {accountAddress && (
                    <>
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Account Name
                        </Heading>
                        <HStack>
                          {accountName ? (
                            <>
                              <Text>{accountName}</Text>
                            </>
                          ) : (
                            <>
                              <Text textAlign={'left'}>Account name not defined.</Text>
                              <VStack>
                                <HStack>
                                  <Input type="text" value={inputName} onChange={handleNameChange} placeholder="Enter a public account name" />
                                  <Button colorScheme="twitter" size="sm" onClick={handleAccountName}>
                                    Apply
                                  </Button>
                                </HStack>
                              </VStack>
                            </>
                          )}
                        </HStack>
                      </Box>
                    </>
                  )}
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Browser Wallet
                    </Heading>
                    <HStack>
                      {account ? (
                        <>
                          <HStack>
                            <Text fontSize="14px">{formatAddress(account)}</Text>
                            {/* Step 2: Add the "Copy to Clipboard" icon */}
                            <Tooltip label="Copy to Clipboard" placement="top">

                            <IconButton aria-label="Copy to Clipboard" variant={'ghost'} icon={<CopyIcon />} size='xs' onClick={handleCopyToClipboard} ml={2} />
</Tooltip>

                          </HStack>
                        </>
                      ) : (
                        <>
                          <HStack w="full">
                            <Text textAlign={'left'}>Account name not defined.</Text>
                            <Button ml={6} colorScheme="twitter" size="sm">
                              Connect Metamask
                            </Button>
                          </HStack>
                        </>
                      )}
                    </HStack>
                  </Box>
                </Stack>
              </CardBody>
            </Card>

            <Card mt={2}>
              <CardHeader>
                <Heading size="md">Calendar</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Background Color
                    </Heading>
                    <Select
                      placeholder="Select Background Color"
                      mt={2}
                      variant={'flushed'}
                      value={backgroundColor}
                      onChange={(event) => onBackGroundChange(event.target.value)}>
                      <option value="#a6d8ef">Blue #1</option>
                      <option value="#32a9e2">Blue #2</option>
                      <option value="#345aa0">Blue #3</option>
                      <option value="#303171">Blue #4</option>
                      <option value="#073b4c">Blue #5</option>
                      <option value="#1DA1F2">Blue #6</option>
                      <option value="#06d6a0">Green #1</option>
                      <option value="#ef476f">Pink #1</option>
                      <option value="#a69cac">Purple #1</option>
                      <option value="#474973 ">Purple #2</option>
                      <option value="#ffd166">Yellow #1</option>
                      <option value="ghostwhite">White #1</option>
                      <option value="white">White #2</option>
                    </Select>
                  </Box>
                  <Center>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Default Calendar
                      </Heading>
                      <HStack>
                        {contractCalendarAddress ? (
                          <>
                            <Text fontSize="14px">{contractCalendarAddress}</Text>
                          </>
                        ) : (
                          <>
                            <Text textAlign={'left'}>No default calendar found..ext</Text>
                            <VStack>
                              <HStack>
                                <Input type="text" value={inputCalendar} onChange={handleCalendarChange} placeholder={`${defaultCalendar}`} size={'sm'} />
                                <Button colorScheme="twitter" size="sm" onClick={handleCalendarAddress}>
                                  Apply
                                </Button>
                              </HStack>
                            </VStack>
                          </>
                        )}
                      </HStack>
                    </Box>
                  </Center>
                </Stack>
              </CardBody>
            </Card>

            {transactionHash && (
              <Box mt={3} bg="#edd5d3" p={2}>
                Transaction hash:{' '}
                <Text as="a" color="blue.500" href={`https://testnet.teloscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                  {formattedTransactionHash}
                </Text>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SettingsDrawer
