import { Button, Box, Alert, AlertIcon, AlertDescription, Text, AlertTitle, HStack, Center } from '@chakra-ui/react'
import { Card, theme } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import TheBUNY from '../../contracts/fuji/TheBUNY.json'
import axios from 'axios'
import { ethers } from 'ethers'
import { networks } from '../../config/networks'
import NftLoginForm2 from '../forms/NftLoginForm2'
import MetamaskSignature from '../MetaMask/MetamaskSignature'
import { AppContext } from '../../AppContext'



const LoginDrawerDynamic = ({inputAddress, inputTokenId, chainId, isOwner}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { account, setAccount, setLogged, setAvatarImage, signature, setSignature, setAccountAddress, accountAddress } =
    useContext(AppContext)
  const [loading, setLoading] = React.useState(true)
 const [inputAccount, setInputAccount] = useState('') // State variable for the account input field
  const [inputImage, setInputImage] = useState(null)
  const [inputName, setInputName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [selectedChainId, setSelectedChainId] = useState(null)
  const [inputDescription, setInputDescription] = useState(null)
  const [nftOwner, setNftOwner] = useState(null)
  
  const [avatarName, setAvatarName] = useState()
  const [balance, setBalance] = useState('')
  const [signedIn, setSignedIn] = useState(null)
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const contentStyle = {
    lineHeight: '260px',
    width: '100%',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: 'ghostwhite',
    marginTop: 16,
  }

  const networkConfig = networks[selectedChainId]
  const selectedChainName = networkConfig?.chainName


 
  // Event handler for the account input field

  
  const updateAccountAddress = (address) => {
    setAccountAddress(address)
  }

  const handleSignedIn = (account) => {
    setAccountAddress(account)
  }

  const [tabIndex, setTabIndex] = useState(0)

  const goTab1 = () => {
    setTabIndex(0) // Switch to tab 1
  }



  // Function to reset all state variables
  const handleReset = () => {
    //setChainId('') // Reset chainId
    setAccountAddress('') // Reset accountAddress
    
    
    setInputAccount('') // Reset inputAccount
    setInputImage(null) // Reset inputImage
    setInputName(null) // Reset inputName
    setNftSymbol(null) // Reset nftSymbol
    //setSelectedChainId(options[0].value) // Reset selectedChainId
    setInputDescription(null) // Reset inputDescription
    setNftOwner(null) // Reset nftOwner
    
  }

  const fetchNFTData = async () => {
    setLoading(true)
    try {
      let metadata = {}
      let provider
      if (selectedChainId === '137') {
        provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com')
      } else if (selectedChainId === '1') {
        provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
      } else if (selectedChainId === 41) {
        provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      } else if (selectedChainId === '40') {
        provider = new ethers.providers.JsonRpcProvider('https://rpc1.eu.telos.net/evm')
      } else if (selectedChainId === 43113) {
        provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
      }
      const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)
      let tokenURI = await contract.tokenURI(inputTokenId)
      if (tokenURI.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
        const cid = tokenURI.replace('ipfs://', '')
        tokenURI = ipfsGatewayUrl + cid
      }
      const nftOwner = await contract.ownerOf(inputTokenId)
      setNftOwner(nftOwner)
      const symbol = await contract.symbol()
      setNftSymbol(symbol)
          const response = await axios.get(tokenURI)
      const { data } = response

      if (!data) {
        throw new Error('No metadata found at provided tokenURI.')
      }
      metadata = data
      let avatarImage = metadata.image
      let avatarName = metadata.name

      // Convert IPFS URL to HTTPS if necessary
      if (avatarImage.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/'
        const cid = avatarImage.replace('ipfs://', '')
        avatarImage = ipfsGatewayUrl + cid
      }
      console.log('Image URL:', avatarImage)

      setInputImage(avatarImage)
      setInputName(avatarName)
      setInputDescription(data.description)
      
      
    } catch (error) {
      console.error('Unable to fetch NFT data:', error)
    }
    setLoading(false)
  }


  const handleNftDetails = (nftOwner, nftSymbol, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }


  
  

  
  const steps = [
   
    {
      title: 'Verify',
      content: (
        <NftLoginForm2
          selectedNetwork={selectedChainName} // replace with your value
          chainId={selectedChainId} // replace with your value
          inputAddress={inputAddress} // replace with your value
          nftOwner={nftOwner} // replace with your value
          nftSymbol={nftSymbol} // replace with your value
          inputTokenId={inputTokenId} // replace with your value
          onNftDetails={handleNftDetails} // replace with your function
          updateAccountAddress={updateAccountAddress} // replace with your function
          goTab1={goTab1} // replace with your function
          //checkOwner={checkOwner}
          fetchNFTData={fetchNFTData}
          isOwner={isOwner}
        />
      ),
      cardTitle: 'Verify NFT',
    },
    {
      title: 'Sign',
      content: [
        <>
          <Box w={'100%'}>
            {!isOwner && !loading && (
              <>
                <Alert status="warning" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="150px">
                  <AlertIcon boxSize="33px" mr={0} />
                  <AlertTitle mt={2} mb={1} fontSize="lg">
                    Account found!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    <Text noOfLines={3} fontSize={'small'}>
                      Account found but you are either not the owner or connecting with the wrong wallet address.
                    </Text>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </Box>
          <Box w={'100%'}>
            {isOwner && !loading && (
              <>
                {!signature ? (
                  <>
                    <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="100px">
                      <AlertIcon boxSize="33px" mr={0} />
                      <AlertTitle mt={2} mb={1} fontSize="lg">
                        Account found!
                      </AlertTitle>
                      <AlertDescription maxWidth="sm">
                        <Text noOfLines={2} fontSize={'small'}>
                          Sign transaction to login
                        </Text>
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <>
                    <Alert
                      status="success"
                      variant="subtle"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      height="100px">
                      <AlertIcon boxSize="33px" mr={0} />
                      <AlertTitle mt={2} mb={1} fontSize="lg">
                        User Verified!
                      </AlertTitle>
                      <AlertDescription maxWidth="sm"></AlertDescription>
                    </Alert>
                  </>
                )}
                <Box p={2} mt={2}>
                  <MetamaskSignature
                    onSignedIn={handleSignedIn}
                    onSignature={(signature) => setSignature('Signature:', signature)}
                    accountAddress={accountAddress}
                    inputAddress={inputAddress}
                    tokenId={inputTokenId}
                    networkName={selectedChainName}
                  />
                </Box>
              </>
            )}
          </Box>
        </>,
      ],
      cardTitle: 'Confirmation',
    },
  ]

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setLogged(false)
          setAccount('')
          setBalance('')
        }
      })

      window.ethereum.on('chainChanged', async () => {
        if (account !== '') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const balance = await provider.getBalance(account)
          setBalance(Number(ethers.utils.formatEther(balance)).toFixed(2))
        }
      })
    }
  }, [account])


  return (
    <>

      <Box w="100%">
        {account && (
          <>

            <div style={contentStyle}>
              <Card bodyStyle={{ padding: '0px' }} headStyle={{ fontSize: '12px', marginTop: '-8px', marginBottom: '4px' }} title={steps[current].cardTitle}>
                {steps[current].content}
              </Card>
            </div>
            <Center w={'100%'} p={1}>
              <HStack>
                <div style={{ marginTop: 2 }}>
                  {current > 0 && (
                    <Button size="sm" onClick={() => prev()}>
                      Previous
                    </Button>
                  )}
                  {/*current === steps.length - 1 && (
                    <Button size="sm" colorScheme="twitter" onClick={() => message.success('Processing complete!')}>
                      Done
                    </Button>
                  )*/}
                  <Button ml={2} mr={2} size="sm" type="default" bg="#917e7a" color="white" onClick={handleReset}>
                    Reset
                  </Button>

                  {current < steps.length - 1 && (
                    <Button size="sm" colorScheme="twitter" onClick={() => next()}>
                      Continue
                    </Button>
                  )}
                </div>
              </HStack>
            </Center>
          </>
        )}
      </Box>
    </>
  )
}

export default LoginDrawerDynamic;
