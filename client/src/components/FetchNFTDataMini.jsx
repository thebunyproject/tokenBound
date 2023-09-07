import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { Avatar, Box, Button, HStack, IconButton, Tag, Text, VStack, Wrap, WrapItem, useToast } from '@chakra-ui/react'
import { networks } from '../config/networks'
import TheBUNY from '../contracts/fuji/TheBUNY.json'
import BunyERC6551Account from '../contracts/fuji/BunyERC6551Account.json'
import BunyERC6551Registry from '../contracts/fuji/BunyERC6551Registry.json'
import { AppContext } from '../AppContext'
import { formatAddress, formatChainAsNum } from '../utils/formatMetamask'
import WhatNetworkName from '../utils/WhatNetworkName'
import { CopyIcon } from '@chakra-ui/icons'
import AccountCheckerDynamic from './AccountCheckerDynamic'
import LoginDrawerDynamic from './drawers/LoginDrawerDynamic'


const FetchNFTDataMini = ({ inputAddress, onNftDetails, inputTokenId, inputChainId }) => {
  const { account } = useContext(AppContext)
  const [metadata, setMetadata] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [avatarImage, setAvatarImage] = useState(null)
  const toast = useToast()
  const [nftOwner, setNftOwner] = useState(null)
const [isOwner, setIsOwner] = useState(false)
  const [totalSupply, setTotalSupply] = useState(null)
  const [description, setDescription] = useState(null)
  const [timestamp, setTimestamp] = useState(null)
  const [explorerUrl, setExplorerUrl] = useState()
  const [accountAddress, setAccountAddress] = useState()

  let provider
  if (inputChainId === '1') {
    provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
  } else if (inputChainId === '43113') {
    provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
  } else if (inputChainId === '41') {
    provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
  } else if (inputChainId === '40') {
    provider = new ethers.providers.JsonRpcProvider('https://telos.net/evm')
  }
  
  
  // This function will be passed to the child component
  const handleAccountAddress = (address) => {
    setAccountAddress(address)
  }

  useEffect(() => {
    const checkAccount = async () => {
      try {
        //const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const implementation = BunyERC6551Account.address
        const salt = '1' // or some other unique number
        const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
        const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, inputTokenId, salt)

        const isAccountFound = !!accountAddress

        if (!isAccountFound) {
          console.log('No account found')
          return
        }

        const accountDetails = await registryContract.tokenBoundAccounts(accountAddress)

        if (accountDetails[0] !== ethers.constants.AddressZero) {
          console.log('Account found')
          console.log(`Implementation address: ${accountDetails[0]}`)
          console.log(`Chain ID: ${accountDetails[1].toString()}`)
          console.log(`Token contract address: ${accountDetails[2]}`)
          console.log(`Token ID: ${accountDetails[3].toString()}`)
          console.log(`Salt: ${accountDetails[4].toString()}`)
          setAccountAddress(accountAddress)
        } else {
          console.log('No account found')
        }
      } catch (error) {
        console.error('Error checking account:', error)
      }
    }

    checkAccount()
  }, [inputChainId, inputAddress, inputTokenId, provider])

  // Select NFT and create ERC6551 token bound account

  useEffect(() => {
    const fetchNFTData = async () => {
      let metadata = {}

      try {
        
     
        //const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)

        let tokenURI = await contract.tokenURI(inputTokenId)
        if (tokenURI.startsWith('ipfs://')) {
          const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
          const cid = tokenURI.replace('ipfs://', '')
          tokenURI = ipfsGatewayUrl + cid
        }
        const nftOwner = await contract.ownerOf(inputTokenId)
        setNftOwner(nftOwner)
        if (nftOwner.toLowerCase() === account){
          setIsOwner(true)
        }
        const symbol = await contract.symbol()
        setNftSymbol(symbol)
        const totalSupply = await contract.totalSupply()
        setTotalSupply(totalSupply.toString())
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
        setMetadata(data)
        setAvatarImage(avatarImage)
        setAvatarName(avatarName)
        setDescription(data.description)
        onNftDetails(nftOwner, isOwner, symbol, totalSupply, avatarImage, avatarName)
      } catch (error) {
        console.error('Unable to fetch NFT data:', error)
      }
    }

    fetchNFTData()
  }, [inputAddress, inputTokenId, inputChainId, account, onNftDetails, isOwner, provider])

  useEffect(() => {
    const fetchExplorerUrl = async () => {
      const networkConfig = networks[inputChainId]
      const explorer = networkConfig?.blockExplorerUrl
      setExplorerUrl(explorer)
    }

    fetchExplorerUrl()
  }, [inputChainId])

  if (!avatarName || !avatarImage) {
    return <div>Waiting to load...</div>
  }

  return (
    
      <HStack >
        <Box w={'auto'}>
        <Avatar size='md' name={avatarName} src={avatarImage} />
        </Box>
        <AccountCheckerDynamic onAccountAddress={handleAccountAddress} inputTokenId={inputTokenId} inputAddress={inputAddress} />
      </HStack>
    
  )
}

export default FetchNFTDataMini
