import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import FetchAccountNftData from './FetchAccountNftData'
import BunyERC6551Registry from '../contracts/fuji/BunyERC6551Registry.json'
import { AppContext } from '../AppContext'
import { Box, Heading, Center, SimpleGrid } from '@chakra-ui/react'

const FetchOwnerAccountNftData = () => {
  const [nfts, setNFTs] = useState([])
  const [chainId, setChainId] = useState()

  const [selectedNetwork, setSelectedNetwork] = useState()

  const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
  const contract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)

  async function fetchAllAccounts() {
    const allNFTs = await contract.getAllRegisteredNfts()
    console.log(allNFTs)
    return allNFTs
  }

  useEffect(() => {
    fetchAllAccounts().then((nfts) => setNFTs(nfts))
  }, [])

  return (
    <div style={{ marginTop: '0px', borderTop: '1px solid #d4cacd' }}>
      <Heading color="#917e7a" as={'h4'}>
        All NFT Accounts
      </Heading>
      <Box w="100%" overflow={'auto'} mb={4} >
<Center>
<SimpleGrid columns={[1, 2, 3, 4]} spacing={4} w={'auto'}>
      {nfts.map((nft, index) => (
        <Box key={index} p={4} bg="white" >
          <FetchAccountNftData inputTokenId={nft.tokenId} chainId={nft.chainId} inputAddress={nft.tokenContract} />
        </Box>
      ))}
    </SimpleGrid>
</Center>
  </Box>
  
    </div>
  )
}

export default FetchOwnerAccountNftData
