import { Center, Box, Text } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import { useContext } from 'react'
import React, { useState, useEffect, useRef } from 'react'
import { message, Steps, Card, theme, useToken } from 'antd'

import {
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  HStack,
} from '@chakra-ui/react'
import TheBUNY from '../../contracts/TheBUNY.json'
import axios from 'axios'
import { ethers } from 'ethers'
import { networks } from './../../config/networks'
import NftLoginForm from './NftLoginForm'
import NftLoginForm2 from './NftLoginForm2'
import MetamaskSignature from '../Metamask/MetamaskSignature'
import MetamaskSdk from '../Metamask/MetamaskSdk'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json'

const options = [
  {
    value: '41',
    label: 'Telos Testnet',
  },
  {
    value: '40',
    label: 'Telos',
  },

  {
    value: '1',
    label: 'Ethereum',
  },
  {
    value: '43114',
    label: 'Avalanche',
  },
  {
    value: '137',
    label: 'Polygon',
  },
]
const CreateAccountForm = ({ onNftDetails, selectedNetwork, goTab1 }) => {
  const { logged, account } = useContext(AppContext)
  const [isOpen, setIsOpen] = React.useState(false)
  const { setLogged, avatarImage, setAvatarImage, signature, setAccount, setSignature, setAccountAddress, accountAddress } = useContext(AppContext)
  const onClose = () => setIsOpen(false)
  const btnRef = useRef()
  const [loading, setLoading] = React.useState(true)
  const [chainId, setChainId] = useState('') //
  const [tokenContract, setTokenContract] = useState()
  const [inputAddress, setInputAddress] = useState('')
  const [inputTokenId, setInputTokenId] = useState('1') // State variable for the inputTokenId input field
  const [inputAccount, setInputAccount] = useState('') // State variable for the account input field
  const [inputImage, setInputImage] = useState(null)
  const [inputName, setInputName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [selectedChainId, setSelectedChainId] = useState(null)
  const [inputDescription, setInputDescription] = useState(null)
  const [nftOwner, setNftOwner] = useState(null)
  const [isOwner, setIsOwner] = useState(null)
  const [avatarName, setAvatarName] = useState()
  const [totalSupply, setTotalSupply] = useState(null)
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
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border:"1px solid #0700dd",
    marginTop: 16,
  }

  const checkAccount = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      const implementation = BunyERC6551Account.address
      const salt = '1' // or some other unique number
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
      const accountAddress = await registryContract.account(implementation, selectedChainId, inputAddress, inputTokenId, salt)
      const isAccountFound = !!accountAddress
      if (!isAccountFound) {
        console.log('No account found')
        return
      }

      const accountDetails = await registryContract.accounts(accountAddress)
      if (accountDetails[0] !== ethers.constants.AddressZero) {
        setAccountAddress(accountAddress)
        fetchNFTData()
        setTokenContract(inputAddress)
      } else {
        fetchNFTData()

        console.log('No account found')
      }
    } catch (error) {
      console.error('Error checking account:', error)
    }
  }

  const networkConfig = networks[selectedChainId]
  const selectedChainName = networkConfig?.chainName

  const handleChange = (event) => {
    setSelectedChainId(event.target.value)
  }

  // Event handler for the token input field
  const handleAddressChange = (event) => {
    setInputAddress(event.target.value)
  }

  // Event handler for the inputTokenId input field
  const handleTokenIdChange = (event) => {
    setInputTokenId(event.target.value)
  }

  // Event handler for the account input field
  const handleAccountChange = (event) => {
    setInputAccount(event.target.value)
  }

  const handleCollectionChange = (value) => {
    setInputAddress(value)
  }

  const updateAccountAddress = (address) => {
    setAccountAddress(address)
  }

  const handleSignedIn = (account) => {
    setAccountAddress(account)
  }

  const checkOwner = async (nftOwner) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    console.log(address)
    if (nftOwner.toLowerCase() === address) {
      setIsOwner(true)
      setTokenContract(inputAddress)
      setAvatarImage(inputImage)
    }
  }
  // Function to reset all state variables
  const handleReset = () => {
    setChainId('') // Reset chainId
    setAccountAddress('') // Reset accountAddress
    setInputAddress('') // Reset inputAddress
    setInputTokenId('1') // Reset inputTokenId
    setInputAccount('') // Reset inputAccount
    setInputImage(null) // Reset inputImage
    setInputName(null) // Reset inputName
    setNftSymbol(null) // Reset nftSymbol
    setSelectedChainId(options[0].value) // Reset selectedChainId
    setInputDescription(null) // Reset inputDescription
    setNftOwner(null) // Reset nftOwner
    setIsOwner(null) // Reset isOwner
  }

  const fetchNFTData = async () => {
    setLoading(true)
    try {
      let metadata = {}
      setIsOwner(false)
      let provider
      if (selectedChainId === '137') {
        provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com')
      } else if (selectedChainId === '1') {
        provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
      } else if (selectedChainId === '41') {
        provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      } else if (selectedChainId === '40') {
        provider = new ethers.providers.JsonRpcProvider('https://rpc1.eu.telos.net/evm')
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
      const ts = await contract.totalSupply()
      setTotalSupply(ts.toString())

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
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
        const cid = avatarImage.replace('ipfs://', '')
        avatarImage = ipfsGatewayUrl + cid
      }
      console.log('Image URL:', avatarImage)

      setInputImage(avatarImage)
      setInputName(avatarName)
      setInputDescription(data.description)
      onNftDetails(nftOwner, symbol, totalSupply, avatarImage, avatarName)
      checkOwner(nftOwner)
    } catch (error) {
      console.error('Unable to fetch NFT data:', error)
    }
    setLoading(false)
  }

  const handleNftDetails = (nftOwner, nftSymbol, totalSupply, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    setTotalSupply(totalSupply.toString())
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }

  const steps = [
    {
      title: 'Load',
      content: (
        <NftLoginForm
          account={account}
          accountAddress={accountAddress}
          loading={loading}
          inputImage={inputImage}
          inputDescription={inputDescription}
          nftOwner={nftOwner}
          selectedChainId={selectedChainId}
          selectedChainName={selectedChainName}
          isOwner={isOwner}
          signedIn={signedIn}
          signature={signature}
          setSignedIn={setSignedIn}
          setSignature={setSignature}
          options={options}
          inputAddress={inputAddress}
          inputTokenId={inputTokenId}
          logged={logged}
          inputAccount={inputAccount}
          handleReset={handleReset}
          handleChange={handleChange}
          handleCollectionChange={handleCollectionChange}
          onInputAddressChange={handleAddressChange}
          onTokenIdChange={handleTokenIdChange}
          checkAccount={checkAccount}
          handleAccountChange={handleAccountChange}
        />
      ),
      cardTitle: 'Load NFT',
    },
    {
      title: 'Verify',
      content: (
        <NftLoginForm2
          selectedNetwork={selectedChainName} // replace with your value
          chainId={selectedChainId} // replace with your value
          inputAddress={inputAddress} // replace with your value
          nftOwner={nftOwner} // replace with your value
          totalSupply={totalSupply}
          nftSymbol={nftSymbol} // replace with your value
          tokenId={inputTokenId} // replace with your value
          onNftDetails={handleNftDetails} // replace with your function
          updateAccountAddress={updateAccountAddress} // replace with your function
          goTab1={goTab1} // replace with your function
          checkOwner={checkOwner}
          fetchNFTData={fetchNFTData}
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

  const items = steps.map((item) => ({ key: item.title, title: item.title }))
  return (
    <Center mt={-2}>

      <Box w="100%">
        {account && (
          <>

            <Center>
            <Steps responsive="false" size="small" current={current} items={items} type='inline' />
            </Center>
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
                  {current === steps.length - 1 && (
                    <Button size="sm" colorScheme="twitter" onClick={() => message.success('Processing complete!')}>
                      Done
                    </Button>
                  )}
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
    </Center>
  )
}

export default CreateAccountForm
