import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { VStack, Box, Text, Center, useToast, HStack, IconButton, Button } from '@chakra-ui/react'
import { networks } from '../config/networks'
import TheBUNY from '../contracts/fuji/TheBUNY.json'
import BunyERC6551Account from '../contracts/fuji/BunyERC6551Account.json'
import BunyERC6551Registry from '../contracts/fuji/BunyERC6551Registry.json'
import { AppContext } from '../AppContext'
import { Tag } from 'antd'
import { formatAddress, formatChainAsNum } from '../utils/formatMetamask'
import WhatNetworkName from '../utils/WhatNetworkName'
import { CopyIcon } from '@chakra-ui/icons'



const FetchAccountNftData = ({ inputAddress, onNftDetails, inputTokenId, inputChainId, onIsOwner }) => {
  const { account } = useContext(AppContext)
  const [metadata, setMetadata] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [avatarImage, setAvatarImage] = useState(null)
  const toast = useToast()
  const [nftOwner, setNftOwner] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [description, setDescription] = useState(null)
  const [explorerUrl, setExplorerUrl] = useState()
  const [accountAddress, setAccountAddress] = useState()

 



  
 


  useEffect(() => {
    const fetchNFTData = async () => {
      let metadata = {}

      try {
        /*
        let provider
        if (inputChainId === '1') {
          provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
        } else if (inputChainId === '41') {
          provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
        } else if (inputChainId === '40') {
          provider = new ethers.providers.JsonRpcProvider('https://telos.net/evm')
        }
        */
        const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)

        let tokenURI = await contract.tokenURI(inputTokenId)
        if (tokenURI.startsWith('ipfs://')) {
          const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
          const cid = tokenURI.replace('ipfs://', '')
          tokenURI = ipfsGatewayUrl + cid
        }
        const nftOwner = await contract.ownerOf(inputTokenId)
        setNftOwner(nftOwner)
        if (isAddress(nftOwner) === isAddress(account)) {
          setIsOwner(true)
          console.log('is nft owner')
          onIsOwner(true)
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
          const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
          const cid = avatarImage.replace('ipfs://', '')
          avatarImage = ipfsGatewayUrl + cid
        }
        
        setMetadata(data)
        setAvatarImage(avatarImage)
        setAvatarName(avatarName)
        setDescription(data.description)
      //  onNftDetails(nftOwner, isOwner, symbol, avatarImage, avatarName)
      } catch (error) {
        console.error('Unable to fetch NFT data:', error)
      }
    }
    function isAddress(address) {
      return address.toLowerCase().startsWith(account);
    }
    fetchNFTData()
  }, [inputAddress, inputTokenId, inputChainId, account, onNftDetails, isOwner, onIsOwner])

  useEffect(() => {
    const fetchExplorerUrl = async () => {
      const networkConfig = networks[inputChainId]
      const explorer = networkConfig?.blockExplorerUrl
      setExplorerUrl(explorer)
    }

    fetchExplorerUrl()
  }, [inputChainId])



  useEffect(() => {
    const checkAccount = async (inputTokenId) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const implementation = BunyERC6551Account.address;
      const salt = 1; 
      //const initData = '0x'; 
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer);
      const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, inputTokenId, salt);
      setAccountAddress(accountAddress);
    
    }
   
    checkAccount(inputTokenId, inputAddress);
  }, [inputTokenId, inputAddress, inputChainId]);


  return (
    <div>
    {inputTokenId && isOwner && ( <>
    <Center bg='ghostwhite' border='0.5px solid silver' mb={-1} w='auto'>
    <HStack  gap='auto' fontSize={'12px'}>
   
        <img width="100px" src={avatarImage} alt={avatarName} />
      
      <VStack bg='ghostwhite' h='100%' p={2} w='auto'>
      <Box >
      
      <HStack mt={2} bg='white' w='100%' gap='auto'>
          <Tag>Name:</Tag>
          <Text>{avatarName}</Text>
        </HStack>


        <HStack gap='2px'>
        <HStack mt={2} bg='white' w='100%' gap='auto'>
          <Tag>TokenId:</Tag>
          <Text>{inputTokenId && <>{inputTokenId.toString()}</>}</Text>
        </HStack>

        {/*
        <HStack mt={2} gap='auto'>
          <Tag>
            <Text>Symbol:</Text>
          </Tag>
          <Text>{nftSymbol}</Text>
        </HStack>
*/}

        </HStack>

{/*
        <HStack overflow={'auto'} mt={2}>
          <Tag>
            <Text>Owner:</Text>
          </Tag>
          <Text>{
            nftOwner && (
              <>
            {formatAddress(nftOwner)}
            </>
            )
          }
            </Text>
          <IconButton
            size={'xs'}
            variant={'unstyled'}
            icon={<CopyIcon />}
            aria-label="Copy Owner Address"
            onClick={() => {
              navigator.clipboard.writeText(formatAddress(nftOwner))
            }}
          />
        </HStack>
        */}

{/*
        <HStack overflow={'auto'} mt={2}>
          <Tag>
            <Text>Contract:</Text>
          </Tag>
          <Text>{inputAddress && (
              <>
            {formatAddress(inputAddress)}
            </>
            )}
            </Text>
          <IconButton
            size={'xs'}
            variant={'unstyled'}
            icon={<CopyIcon />}
            aria-label="Copy Contract Address"
            onClick={() => {
              navigator.clipboard.writeText(formatAddress(inputAddress))
            }}
          />
          
        </HStack>
        */}

        
        <HStack overflow={'auto'} mt={2} bg='white'>
          <Tag>
            <Text>Account:</Text>
          </Tag>
          <Text>{
            accountAddress && (<>
            {formatAddress(accountAddress)}
            </>
            )}
            </Text>
          <IconButton
            size={'xs'}
            variant={'unstyled'}
            icon={<CopyIcon />}
            aria-label="Copy Account Address"
            onClick={() => {
              navigator.clipboard.writeText(accountAddress)
            }}
          />
        </HStack>

        <HStack mt={2} bg='white'>
          <Tag>Network:</Tag>
          <WhatNetworkName inputChainId={formatChainAsNum(inputChainId)} />
        </HStack>


{/*
        <HStack mt={2} mb={2} overflow={'auto'}>
          <Tag>Description:</Tag>
          <Text noOfLines={4}>{description}</Text>
        </HStack>

        */}


     
      </Box>
    </VStack>


      </HStack>
      </Center>
     
    </>)}
    {isOwner && (
        <>
          <Button mt={2} w={'100%'} colorScheme='twitter' size={'sm'}>
            Load Account
          </Button>

        </>
      )}
  </div>
  )
}

export default FetchAccountNftData
