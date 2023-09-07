import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import BunyERC6551Registry from '../../contracts/fuji/BunyERC6551Registry.json'
import { List, ListItem, Center, VStack, Text, Box, HStack, Spinner } from '@chakra-ui/react';
import WhatNetworkName from '../../utils/WhatNetworkName';
import { formatChainAsNum } from '../../utils/formatMetamask';
import WhatCollectionName from '../../utils/WhatCollectionName';

const FetchAllAccountsFuji = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    async function fetchAllAccounts() {
      try {
        setLoading((true))
        const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const contract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)      
        const allNFTs = await contract.getAllRegisteredNfts()
        console.log(allNFTs)
        return allNFTs
      } catch (err) {
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    }
  
    fetchAllAccounts().then((accounts) => setAccounts(accounts))
  }, [])

return(


  <>

    
      <>
        <Text fontSize="x2" fontWeight="bold" mb={2}>
          All Accounts
        </Text>
      </>
    
    <List spacing={3} bg="white" color="black">
  {accounts.map((nft, i) => (
    <ListItem key={i} p={2}>
      <Center>
        <VStack>
          <Text fontSize={'12px'}> {nft.implementation}</Text>
          <Box border="1px solid #c1cfd8" p={4}>
            <Text mb={4} noOfLines={3} overflow={'hidden'} fontSize={'12px'}>
              {' '}
              {nft.tokenContract}
            </Text>
            <WhatCollectionName inputAddress={nft.tokenContract} inputChainId={nft.chainId.toString()} />
            

            <HStack>
            <Text>
              Token Id:
            </Text>
            <Text>
                {nft.tokenId.toString()}
            </Text>
            </HStack>

            <HStack>
            <Text>
              Network:
            </Text>
            <Text>
                ({nft.chainId.toString()})
            </Text>
            <WhatNetworkName chainId={formatChainAsNum(nft.chainId)}/>
            </HStack>
          </Box>
        </VStack>
      </Center>
    </ListItem>
  ))}
</List>
  </>

)
      }
      export default FetchAllAccountsFuji