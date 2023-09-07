import { Card, theme } from 'antd'
import { Button, Box, Alert, AlertIcon, AlertDescription, Text, AlertTitle, HStack, Tooltip, Center, Image, VStack, Avatar } from '@chakra-ui/react'
import React, { useState, useEffect, useRef, useContext } from 'react'
import BunyERC6551Registry from '../../contracts/fuji/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/fuji/BunyERC6551Account.json'
import TheBUNY from '../../contracts/TheBUNY.json'
import axios from 'axios'
import { ethers } from 'ethers'
import { networks } from '../../config/networks'
import NftLoginForm from '../forms/NftLoginForm'
import NftLoginForm2 from '../forms/NftLoginForm2'
import MetamaskSignature from '../MetaMask/MetamaskSignature'
import { formatAddress, formatChainAsNum } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext'
import WhatNFTImage from '../../utils/WhatNFTImage'
import WhatNFTName from '../../utils/WhatNFTName'
import { RepeatIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import WhatIsBound from '../../utils/WhatIsBound'
import WhatCollectionName from '../../utils/WhatCollectionName'
import WhatNFTOwner from '../../utils/WhatNFTOwner'

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
    value: '43113',
    label: 'Fuji Testnet',
  },
  {
    value: '137',
    label: 'Polygon',
  },
]

const AccountLogin = ({ onAccountAddressChange, onNftDetails }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const {
    account,
    setAccount,
    logged,
    setLogged,
    avatarImage,
    setAvatarImage,
    tokenContract,
    tokenId,
    setTokenId,
    setTokenContract,
    signature,
    setSignature,
    setAccountAddress,
    accountAddress,
  } = useContext(AppContext)
  const [loading, setLoading] = React.useState(true)
  const [chainId, setChainId] = useState('') //
  const [inputAddress, setInputAddress] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [inputTokenId, setInputTokenId] = useState(null) // State variable for the inputTokenId input field
  const [inputAccount, setInputAccount] = useState('') // State variable for the account input field
  const [inputImage, setInputImage] = useState(null)
  const [inputName, setInputName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [selectedChainId, setSelectedChainId] = useState(null)
  const [inputDescription, setInputDescription] = useState(null)
  const [nftOwner, setNftOwner] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [avatarName, setAvatarName] = useState()
  const [signedIn, setSignedIn] = useState(null)
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)

  const createAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const implementation = BunyERC6551Account.address
    const chainId = selectedChainId
    const salt = '1' // or some other unique number
    const initData = '0x' // no init data
    const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
    const create = await registryContract.createAccount(implementation, chainId, inputAddress, inputTokenId, salt, initData)
    console.log(create.hash)
    console.log(create.confirmations)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const contentStyle = {
    //lineHeight: '260px',
    width: '100%',
    padding: '4px',
    textAlign: 'left',
    color: token.colorTextTertiary,
    backgroundColor: '#6a14fc',
    borderRadius: token.borderRadiusLG,
    border: `0px solid ${token.colorBorder}`,
    marginTop: 16,
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

  const handleIsOwner = (event) => {
    setIsOwner(event)
  }

  const handleNftOwner = (nftOwner) => {
    setNftOwner(nftOwner)
  }
  // Event handler for the inputTokenId input field
  const handleTokenIdChange = (event) => {
    setInputTokenId(event.target.value)
  }

  // Event handler for the account input field
  const handleAccountChange = (event) => {
    setInputAccount(event.target.value)
  }

  const handleIsActive = (value) => {
    setIsActive(value)
  }

  const handleCollectionChange = (value) => {
    setInputAddress(value)
  }

  const handleAccountAddress = (address) => {
    setAccountAddress(address)
  }

  const handleSignedIn = (account) => {
    setAccountAddress(account)
  }

  useEffect(() => {
    // Call the checkOwner function whenever nftOwner changes
    if (nftOwner) {
      const checkOwner = async (nftOwner) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        console.log(address)
        if (nftOwner === address) {
          setIsOwner(true)
          setTokenContract(inputAddress)
          setAvatarImage(inputImage)
          setTokenId(inputTokenId)
        }
      }
      checkOwner(nftOwner)
    }
    if (isOwner) {
      const checkAccount = async () => {
        try {
          const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
          const implementation = BunyERC6551Account.address
          const salt = '1' // or some other unique number
          const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
          const accountAddress = await registryContract.account(implementation, selectedChainId, inputAddress, inputTokenId, salt)
          const isAccountFound = !!accountAddress
          if (!isAccountFound) {
            console.log('No account found')
            return
          }
          const accountDetails = await registryContract.getAccountDetails(accountAddress)
          if (accountDetails[0] !== ethers.constants.AddressZero) {
            setAccountAddress(accountAddress)
            onAccountAddressChange(accountAddress)
            //fetchNFTData()
            setTokenContract(inputAddress)
          } else {
            console.log('No account found')
          }
        } catch (error) {
          console.error('Error checking account:', error)
        }
      }
      checkAccount()
    }
  }, [
    inputAddress,
    inputImage,
    inputTokenId,
    isOwner,
    nftOwner,
    onAccountAddressChange,
    selectedChainId,
    setAccountAddress,
    setAvatarImage,
    setTokenContract,
    setTokenId,
  ])

  // Function to reset all state variables
  const handleReset = () => {
    setChainId('') // Reset chainId
    setAccountAddress('') // Reset accountAddress
    setInputAddress('') // Reset inputAddress
    setInputTokenId(null) // Reset inputTokenId
    setInputAccount('') // Reset inputAccount
    setInputImage(null) // Reset inputImage
    setInputName(null) // Reset inputName
    setNftSymbol(null) // Reset nftSymbol
    setSelectedChainId(options[0].value) // Reset selectedChainId
    setInputDescription(null) // Reset inputDescription
    setNftOwner(null) // Reset nftOwner
    setIsOwner(null) // Reset isOwner
    prev()
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
      } else if (selectedChainId === '41') {
        provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      } else if (selectedChainId === '43113') {
        provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
      } else if (selectedChainId === '40') {
        provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
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
      if (nftOwner && account) {
        const lowerNftOwner = ethers.utils.getAddress(nftOwner.toLowerCase())
        const lowerAddress = ethers.utils.getAddress(account.toLowerCase())

        if (lowerNftOwner === lowerAddress) {
          setIsOwner(true)
          setTokenContract(inputAddress)
        } else {
          setIsOwner(false)
        }
      } else {
        setIsOwner(false)
      }
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
      onNftDetails(nftOwner, symbol, avatarImage, avatarName)
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
          onInputTokenIdChange={handleTokenIdChange}
          handleAccountChange={handleAccountChange}
        />
      ),
      cardTitle: 'Load NFT',
    },
    {
      title: 'Verify',
      content: (
        <NftLoginForm2
          selectedNetwork={selectedChainName}
          chainId={selectedChainId}
          inputAddress={inputAddress}
          nftOwner={nftOwner}
          nftSymbol={nftSymbol}
          inputName={inputName}
          inputTokenId={inputTokenId}
          onNftDetails={handleNftDetails}
          handleAccountAddress={handleAccountAddress}
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
                <Alert
                  color="black"
                  status="warning"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  height="150px">
                  <AlertIcon boxSize="33px" mr={0} />
                  <AlertTitle mt={2} mb={1} fontSize="lg">
                    NFT found but you are not the owner!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    <Text noOfLines={3} fontSize={'small'}>
                      Double check your inputs and try again.
                    </Text>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </Box>
          <Box w={'100%'} p={4}>
            {isOwner && !loading && (
              <>
                {!signature ? (
                  <>
                    <Alert
                      status="info"
                      variant="subtle"
                      flexDirection="column"
                      alignItems="left"
                      justifyContent="left"
                      textAlign="left"
                      height="auto"
                      bg="white"
                      color="#6a14fc">
                      <HStack>
                        <AlertIcon boxSize="23px" mr={0} />
                        <AlertTitle mt={2} mb={1} fontSize="lg">
                          NFT found!
                        </AlertTitle>
                      </HStack>

                      <HStack>
                        <Text>NFT:</Text>
                        {tokenContract && (
                          <>
                            <Text>{formatAddress(tokenContract)}</Text>
                          </>
                        )}
                      </HStack>

                      <HStack>
                        <Text>Token Id:</Text>
                        {inputTokenId && (
                          <>
                            <Text>{inputTokenId && <>{inputTokenId.toString()}</>}</Text>
                          </>
                        )}
                      </HStack>

                      <HStack>
                        <Text>Connected user is owner?</Text>

                        <Text>{isOwner.toString()}</Text>
                      </HStack>

                      <HStack>
                        <Text>Owner:</Text>
                        <Text overflow={'auto'} noOfLines={2}>
                          {nftOwner && <>{nftOwner}</>}
                        </Text>
                      </HStack>

                      <AlertDescription maxWidth="sm">
                        <div>
                          {!isActive && (
                            <>
                              <Text noOfLines={2} fontSize={'small'}>
                                NFT found but is not token bound.
                              </Text>

                              <Text>Sign transaction and create account to continue</Text>
                            </>
                          )}
                        </div>
                        <WhatIsBound onIsActive={handleIsActive} accountAddress={accountAddress} />
                      </AlertDescription>
                    </Alert>
                    {!isActive && (
                      <>
                        <Center bg="ghostwhite" p={2} color="black">
                          <VStack>
                            <WhatCollectionName inputAddress={inputAddress} inputChainId={selectedChainId} />
                            <WhatNFTName
                              onIsOwner={handleIsOwner}
                              onNftOwner={handleNftOwner}
                              inputAddress={inputAddress}
                              inputChainId={selectedChainId}
                              inputTokenId={inputTokenId}
                            />
                            <WhatNFTOwner inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                            <WhatNFTImage size={'lg'} inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                            <Button onClick={createAccount} variant={'outline'} size={'md'} colorScheme="telegram">
                              Create Account
                            </Button>
                          </VStack>
                        </Center>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Alert
                      bg="white"
                      status="success"
                      variant="subtle"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      height="auto">
                      <Center>
                        <VStack>
                          <model-viewer
                            style={{
                              width: '250px',
                              height: '250px',
                              //marginTop: '-3px',
                              //backgroundColor: 'transparent',
                            }}
                            src="/successful-login2.glb"
                            poster="/telos.png"
                            shadow-intensity="0.99"
                            auto-rotate
                            shadow-softness="0.57"></model-viewer>
                          <Image src={'/signature-matched.png'} width="200px" />
                          <Box p={2}>
                            <Avatar src={avatarImage} size={'lg'} name={avatarName} />
                          </Box>
                        </VStack>
                      </Center>
                    </Alert>
                  </>
                )}
                <Box p={2} mt={2}>
                  <MetamaskSignature
                    onSignedIn={handleSignedIn}
                    accountAddress={accountAddress}
                    inputAddress={inputAddress}
                    tokenId={inputTokenId}
                    inputChainId={chainId}
                    inputName={inputName}
                    networkName={selectedChainName}
                    isActive={isActive}
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

  return (
    <>
      <div style={contentStyle}>
        <Card
          actions={
            current < steps.length - 1
              ? [
                  <WhatNFTName inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />,
                  <WhatNFTImage size={'md'} inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />,
                  <Button size="lg" variant={'ghost'} color="#6a14fc" onClick={() => next()}>
                    {inputTokenId && !signature && (
                      <>
                        <Text fontSize={'lg'}>Continue</Text>
                      </>
                    )}
                  </Button>,
                ]
              : []
          }
          bodyStyle={{ backgroundColor: '#6a14fc', color: 'white', padding: '0px' }}
          style={{ backgroundColor: '#6a14fc', color: 'white', padding: '0px' }}
          headStyle={{ backgroundColor: '#6a14fc', color: 'white', marginBottom: '-20px', fontSize: '12px' }}
          title={[
            steps[current].cardTitle,
            <Tooltip label="Reset NFT Data" aria-label="reset">
              <IconButton
                isRound={true}
                variant="unstyled"
                textAlign={'right'}
                mt={-1}
                onClick={handleReset}
                colorScheme="whiteAlpha"
                aria-label="Done"
                fontSize="12px"
                icon={<RepeatIcon />}
              />
            </Tooltip>,
          ]}>
          {steps[current].content}
        </Card>
      </div>
    </>
  )
}

export default AccountLogin
