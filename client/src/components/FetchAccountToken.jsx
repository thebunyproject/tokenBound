import React, { useEffect, useContext, useCallback, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import {Tooltip, IconButton, Avatar, Text, HStack, VStack, Wrap, WrapItem, Center, Box } from '@chakra-ui/react'

import { ImportOutlined, WalletOutlined } from '@ant-design/icons'
import { CopyIcon, RepeatIcon, CalendarIcon } from '@chakra-ui/icons'

import BunyERC6551Account from '../contracts/fuji/BunyERC6551Account.json'
import TheBUNY from '../contracts/TheBUNY.json'
import { formatAddress } from '../utils/formatMetamask'
import { AppContext } from '../AppContext'

import WhatNetworkName from '../utils/WhatNetworkName'
import { formatChainAsNum } from '../utils/formatMetamask'



const FetchAccountToken = ({ chainId, tokenId, accountAddress, handleCopyAccount }) => {
  const { account, avatarImage, setAccountName, accountName, setAvatarImage, logged } = useContext(AppContext)
  const [_tokenId, _setTokenId] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  //const [avatarImage, setAvatarImage] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  //const [accountName, setAccountName] = useState(null);
  const [tokenContract, setTokenContract] = useState(null)
  const [_chainId, _setChainId] = useState(null)

  const fetchAccountToken = useCallback(async () => {
    try {
      if (!accountAddress) {
        return; // Nothing to fetch if the accountAddress is not available
      }
  
      let metadata = {};
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer);
      const token = await contract.token();
      setTokenContract(token.tokenContract);
      console.log(`NFT TokenID: ${token.tokenId}`);
      _setTokenId(token.tokenId.toString());
      const name = await contract.accountName();
      setAccountName(name);
      _setChainId(formatChainAsNum(token.chainId));
  
      // Handle revert data for contract.getBalance()
      let bal;
      try {
        bal = await contract.getBalance();
      } catch (error) {
        console.error('Error fetching account balance:', error);
        if (error.data) {
          console.error('Revert data:', error.data);
        }
        // Handle the error or display a user-friendly message
        // For example, setAccountBalance to a default value or show an error message to the user.
        return;
      }
      setAccountBalance(ethers.utils.formatEther(bal, 'ether'));
  
      const nft = new ethers.Contract(TheBUNY.address, TheBUNY.abi, provider);
      let tokenURI = await nft.tokenURI(tokenId);
      if (tokenURI.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/'; // Replace with your preferred IPFS gateway URL
        const cid = tokenURI.replace('ipfs://', '');
        tokenURI = ipfsGatewayUrl + cid;
      }
      const symbol = await nft.symbol();
      console.log(symbol);
      setNftSymbol(symbol);
  
      const response = await axios.get(tokenURI);
      const { data } = response;
      if (!data) {
        throw new Error('No metadata found at provided tokenURI.');
      }
      metadata = data;
      let avatarImage = metadata.image;
      let avatarName = metadata.name;
  
      // Convert IPFS URL to HTTPS if necessary
      if (avatarImage.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/'; // Replace with your preferred IPFS gateway URL
        const cid = avatarImage.replace('ipfs://', '');
        avatarImage = ipfsGatewayUrl + cid;
      }
      console.log('Image URL:', avatarImage);
      setAvatarImage(avatarImage);
      setAvatarName(avatarName);
    } catch (error) {
      console.error('Error fetching account token:', error);
      // Handle the error or display a user-friendly message.
      // For example, show an error toast or a popup with the error message.
    }
  }, [accountAddress]); // Update the dependencies as needed
  

  useEffect(() => {
    if (accountAddress) {
      fetchAccountToken()
    }
  }, [accountAddress, fetchAccountToken])

  return (
    <div>
      

      
      <VStack bg='ghostwhite' mb={2} p={2} border='1px solid silver'>
          <Avatar border="2px solid silver" size="lg" name={avatarName} src={avatarImage} />
        <HStack  p={2} bg='white' w={200}  border='1px solid silver'>
        <Text noOfLines={1}>
          {accountName ? (
            <>
              {accountName}
            </>
          ):(
            <>
            <Text noOfLines={1} p={2} bg='white' w={200}>
            {avatarName}</Text>
            </>
          )}
        </Text>
        
        </HStack>
        <HStack mt={-4} mb={-2} p={1} >
        <Tooltip label="Wallet">
        <IconButton color="black" bg={'transparent'} size={'md'} icon={<WalletOutlined />} />
        </Tooltip>
        <Tooltip label="Import">
          <IconButton color="black" bg={'transparent'} size={'md'} icon={<ImportOutlined />} />
          </Tooltip>
          <Tooltip label="Reload">
            <IconButton color="black" bg={'transparent'} size={'md'} onClick={fetchAccountToken} icon={<RepeatIcon />} />
          </Tooltip>
          <Tooltip title="Settings">
          </Tooltip>

          {/*<IconButton color="black" bg={'transparent'} size={'md'} icon={<CalendarIcon />} />*/}
        </HStack>
        <Box bg='white' p={2} w={'100%'} border='1px solid silver'>
        <HStack mt={-2}>
          <Text as="b">Account:</Text>
          <Text fontSize="12px" onClick={handleCopyAccount}>
            {' '}
            {formatAddress(accountAddress)}
          </Text>
        </HStack>

        <HStack>
          <Text as="b">NFT:</Text>
          <Text fontSize="12px">{tokenContract && <>{formatAddress(tokenContract)}</>}</Text>
        </HStack>


        <HStack>
          <Text as="b" fontSize="12px">
            Network:
          </Text>
          <WhatNetworkName chainId={_chainId} />
        </HStack>


        <HStack>
          <Text fontSize="12px" as="b">
            TokenID:
          </Text>
          <Text fontSize="12px">{_tokenId}</Text>
        </HStack>

</Box>
        </VStack>
     

        
        {/*
            
        
        
                <WithdrawModal />
        
        
                <Menu>
                  <MenuButton
                    as={Button}
                    size="auto"
                    type="primary"
                    transition="all 0.2s"
                    borderRadius="md"
                    borderWidth="1px"
                    _hover={{ bg: 'gray.400' }}
                    _expanded={{ bg: 'blue.400' }}
                    _focus={{ boxShadow: 'outline' }}>
                    Create <ChevronDownIcon />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <EventModal accountAddress={accountAddress} />
                    </MenuItem>

                    <MenuItem>
                      <ListItemModal />
                    </MenuItem>

                    <MenuItem>
                      <TicketModal />
                    </MenuItem>
                  </MenuList>
                </Menu>
        

            */}


    </div>
  )
}

export default FetchAccountToken
