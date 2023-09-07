import './App.css'
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { Layout } from 'antd'
import { HStack, Box, Image, Grid, GridItem } from '@chakra-ui/react'
import { Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { AppContext } from './AppContext'
import NetworkSwitcherIconOnly from './components/MetaMask/NetworkSwitcherIconOnly'
import { HeaderConnect } from './components/MetaMask/HeaderConnect'
import { formatChainAsNum } from './utils/formatMetamask'
import AccountAddressMenu from './components/AccountAddressMenu'
import AddressMenu from './components/AddressMenu'
import ThreeColumns from './components/Layout/ThreeColumns'
import AccountDashboard from './components/AccountDashboard'
import useSessionStorageState from 'use-session-storage-state'

function App() {
  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [tokenContract, setTokenContract] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [connectedNetwork, setConnectedNetwork] = useState(null)
  const [avatarImage, setAvatarImage] = useState(null)
  const [accountName, setAccountName] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [hasProvider, setHasProvider] = useState(null)
  const [nftOwner, setNftOwner] = useState('')
  const [provider, setProvider] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [logged, setLogged] = useState(false)
  const [signature] = useSessionStorageState(null)

  const handleNftDetails = (nftOwner, nftSymbol, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    //setTotalSupply(totalSupply.toString())
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }

  const handleDisconnect = () => {
    setLogged(false)
    setAccount(null)
  }

  const handleBalance = (address, provider) => {
    if (address && provider) {
      provider
        .getBalance(address)
        .then((balance) => {
          let formattedBalance = ethers.utils.formatEther(balance)
          setBalance(Number(formattedBalance).toFixed(3))
        })
        .catch((error) => {
          console.error('Error while fetching the balance:', error.message)
          console.error('Stack trace:', error.stack)

          // Check if the error is due to a revert with reason
          if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
            const reason = error.data ? ethers.utils.toUtf8String(error.data) : ''
            console.log('Revert reason:', reason)
          }

          // You can add more specific error handling based on the error code or message if required.
        })
    }
  }

  useEffect(() => {
    if (provider && account) {
      provider.on('block', () => {
        handleBalance(account, provider)
      })
    }
    return () => {
      if (provider) {
        provider.removeAllListeners('block')
      }
    }
  }, [provider, account])

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider))
      setLogged(true)
    }

    getProvider()
  }, [])

  useEffect(() => {
    try {
      const checkConnection = async () => {
        if (!window.ethereum) {
          console.log('Please install MetaMask!')
          return
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(formatChainAsNum(chainId)) // Set the chainId state variable

        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const logged = accounts.length > 0
        setLogged(logged)

        if (logged) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const account = accounts[0]
          const balance = await provider.getBalance(account)
          const formattedBalance = ethers.utils.formatEther(balance)
          setAccount(account)
          setBalance(Number(formattedBalance).toFixed(2))
        }
      }

      checkConnection().catch((error) => {
        console.error('An error occurred while logged into MetaMask:', error.message)
        console.error('Stack trace:', error.stack)

        // Check if the error is due to a revert with reason
        if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
          const reason = error.data ? ethers.utils.toUtf8String(error.data) : ''
          console.log('Revert reason:', reason)
        }
      })
    } catch (error) {
      console.error('An error occurred in useEffect:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }, [])

  const reloadPage = () => {
    window.location.reload()
  }

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Ethereum'
      case 40:
        return 'Telos'
      case 41:
        return 'Telos Testnet'
      case 43114:
        return 'Avalanche'
      default:
        return 'Unknown Network'
    }
  }

  useEffect(() => {
    const networkName = getNetworkName(chainId)
    console.log(`Connected to: ${networkName}`)
    setConnectedNetwork(networkName)
  }, [chainId])

  // This function will be passed to the child component
  const updateAccountAddress = (address) => {
    setAccountAddress(address)
  }

  return (
    <AppContext.Provider
      value={{
        logged,
        setLogged,
        account,
        setAccount,
        chainId,
        setChainId,
        accountAddress,
        setAccountAddress,
        avatarImage,
        setAvatarImage,
        tokenContract,
        setTokenContract,
        tokenId,
        setTokenId,
        accountName,
        setAccountName,
      }}>
      <>
        <Layout style={{ overflow: 'hidden' }}>
          <Layout overflow={'hidden'}>
            <Box w="100%" borderTop="0px solid white" bg="#6a14fc">
              <Grid borderBottom="4px solid silver" width="100%" templateColumns="repeat(4, 1fr)" gap={0} position={'fixed'} zIndex={'banner'} bg="#6a14fc">
                <GridItem colSpan={2} h="10">
                  <Image w={'80px'} h={'40px'} mt={0} mb={1} src="/bunyLogo2.png" />
                </GridItem>

                <GridItem colStart={4} colEnd={6} h="10">
                  <HStack gap={1} justify={'right'} mt={1}>
                    <NetworkSwitcherIconOnly />
                    <div>
                      {logged ? (
                        <>
                          {!signature && (
                            <>
                              <AddressMenu handleDisconnect={handleDisconnect} balance={balance} />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <HeaderConnect />
                        </>
                      )}

                      {accountAddress && signature && (
                        <>
                          <AccountAddressMenu handleDisconnect={handleDisconnect} />
                        </>
                      )}
                    </div>

                    <div>
                      {/* NFT Account Profile Modal */}
                      {signature && avatarImage && accountAddress && (
                        <>
                          <Avatar size={'sm'} src={avatarImage} border="2px solid white" onClick={onOpen} />
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>NFT Profile</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <AccountDashboard />
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </>
                      )}
                    </div>
                    {/* Primary Menu */}
                  </HStack>
                </GridItem>
              </Grid>
            </Box>
          </Layout>
          <ThreeColumns onNftDetails={handleNftDetails} onAccountAddressChange={updateAccountAddress} />
        </Layout>
      </>
    </AppContext.Provider>
  )
}

export default App
