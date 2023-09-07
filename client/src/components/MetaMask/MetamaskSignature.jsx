import { Box, Button, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react'
import { ethers, utils } from 'ethers'
import React, { useState, useEffect, useContext } from 'react'
import { CopyIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyERC6551Registry from '../../contracts/fuji/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/fuji/BunyERC6551Account.json'
import useSessionStorageState from 'use-session-storage-state'

const MetamaskSignature = ({ isActive, inputName, accountAddress, inputAddress, networkName, tokenId }) => {
  const toast = useToast()
  const [balance, setBalance] = useState()
  const [onboarding, setOnboarding] = useState(null)
  const { account, setAccount, setAccountAddress, logged } = useContext(AppContext)
  const [provider, setProvider] = useState('')
  const [signature, setSignature] = useSessionStorageState(null)
  const [address, setAddress] = useState('')
  const [verifyAddress, setVerifyAddress] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')

  const mess = `Account Address: ${accountAddress}\nToken Contract: ${inputAddress}\nToken Id: ${tokenId.toString()}\nNFT: ${inputName}\nNetwork: ${networkName}`
  const dataRows = mess.split('\n')

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
    // Step 2: Show a toast notification when the copy action is successful
    toast({
      title: 'Copied to Clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  useEffect(() => {
    //*
    //  Load NFT Account address
    const checkAccount = async (inputChainId) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const implementation = BunyERC6551Account.address
      //const chain = formatChainAsNum(inputChainId)
      const salt = 1 // or some other unique number
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
      //await registryContract.createAccount(implementation, inputChainId, inputAddress, tokenId, salt, initData)
      const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, tokenId, salt)
      console.log(`This NFT Account Address is: ${accountAddress}`)
      setAccountAddress(accountAddress)
    }
    checkAccount()
  }, [inputAddress, setAccountAddress, tokenId])

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          console.log(result)
          //setLogged(true);
          const address = utils.getAddress(result[0])
          setAccount(address)
          const newProvider = new ethers.providers.Web3Provider(window.ethereum)
          setProvider(newProvider)
          handleBalance(address, newProvider)
        })
        .catch(() => {
          console.log('Could not detect Account')
        })
    } else {
      console.log('Need to install MetaMask')
      onboarding.startOnboarding()
    }
  }

  const handleBalance = () => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance))
      })
      .catch(() => {
        console.log('Could not detect the Balance')
      })
  }

  const handleSign = async () => {
    const message = mess
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    const address = await signer.getAddress()
    setSignature(signature)
    setAddress(address)
    console.log('sig : ' + signature)
  }

  // Select NFT and create ERC6551 token bound account
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createAccount = async (tokenId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const implementation = BunyERC6551Account.address // Contract address of account contract
    const inputChainId = 43113
    const salt = 1 // can be any random number
    const initData = '0x' // not being used
    const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
    await registryContract.createAccount(implementation, inputChainId, inputAddress, tokenId, salt, initData)
    const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, tokenId, salt)
    setAccountAddress(accountAddress)
  }

  useEffect(() => {
    if (signature) {
      const verify = () => {
        const actualAddress = utils.verifyMessage(mess, signature)
        console.log(actualAddress)
        setVerifyAddress(actualAddress)
        if (signature) {
          console.log('valid signature')
          setVerificationStatus('Verification Successful..User Logged In!')
          //onSignature(signature)
        } else {
          console.log('wrong')
          setVerificationStatus('Invalid')
        }
      }
      verify()
    }
  }, [mess, signature])

  return (
    <Box>
      {!logged ? (
        <VStack spacing={3}>
          <Text fontSize="12px">Log in with Metamask wallet</Text>
          <Button onClick={handleLogin} colorScheme="twitter">
            Connect
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3}>
          {!signature && isActive && (
            <>
              <Button w="100%" onClick={() => handleSign()} size={'sm'} colorScheme="twitter">
                Sign & Login
              </Button>
            </>
          )}
          {signature && (
            <>
              <Box bg="ghostwhite" border="1px solid silver" p={3} fontSize="12px" rounded="md" w={'100%'}>
                <Text noOfLines={6} fontSize="12px" color="#0700dd" textAlign={'left'}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={0}>
                    {dataRows.map((rowData, index) => {
                      const [key, value] = rowData.split(':')

                      // Truncate the first 6 characters and the last 6 characters for the first two fields (Account Address and Token Contract)
                      const displayValue =
                        index < 2 ? (value.length > 12 ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}` : value) : value.trim()

                      return (
                        <React.Fragment key={index}>
                          <GridItem p={1}>{key}</GridItem>
                          <GridItem p={1}>
                            <HStack justify="center">
                              <div>{displayValue && <>{displayValue}</>}</div>
                              {index < 2 && (
                                <IconButton
                                  size="xs"
                                  variant={'outline'}
                                  aria-label="Copy to Clipboard"
                                  icon={<CopyIcon />}
                                  onClick={() => copyToClipboard(value)}
                                />
                              )}
                            </HStack>
                          </GridItem>
                        </React.Fragment>
                      )
                    })}
                  </Grid>
                </Text>
              </Box>

              <Box bg="ghostwhite" textAlign={'left'} p={3} rounded="md" w={'100%'} border="1px solid silver">
                <Text as="b" color="black">
                  Signature
                </Text>
                <Text fontSize="14px" color="black" bg="white" p={4} border="1px solid silver">
                  {signature && <>{signature}</>}
                </Text>
              </Box>

              <Box bg="ghostwhite" p={3} rounded="md" w={'100%'} border="1px solid silver">
                <Text fontSize="14px" color="purple.500" bg="white" p={4} border="1px solid silver">
                  {verificationStatus.toString()}

                  {!isActive && (
                    <>
                      <Button variant={'solid'} colorScheme="twitter" w="100%" onClick={createAccount}>
                        Create Account
                      </Button>
                    </>
                  )}
                </Text>
              </Box>
            </>
          )}
        </VStack>
      )}
    </Box>
  )
}

export default MetamaskSignature
