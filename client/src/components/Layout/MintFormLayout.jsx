import { Heading, StackDivider } from '@chakra-ui/react'
import MintIBUNY from '../forms/MintIBUNY'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { Box, Text, VStack } from '@chakra-ui/react'
import BunyERC6551Account from '../../contracts/fuji/BunyERC6551Account.json'
import BunyERC6551Registry from '../../contracts/fuji/BunyERC6551Registry.json'
import TheBUNY from '../../contracts/fuji/TheBUNY.json'
import { AppContext } from '../../AppContext'
import { useContext } from 'react'
import IBUNYDashboard from '../IBUNYDashboard'

export default function MintFormLayout() {
  const [nfts, setNfts] = useState([])
  const [nftError, setNftError] = useState()
  const { account } = useContext(AppContext)

  // This function will be passed to the child component

  // Select NFT and create ERC6551 token bound account

  useEffect(() => {
    async function fetchNfts() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, provider)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      const ownedNFTs = await contract.tokensOfOwner(userAddress)
      if (ownedNFTs.length === 0) {
        console.log('No NFTs found.')
        setNftError('No NFTs found')
        return
      }
      const tokenData = await Promise.all(
        ownedNFTs.map(async (tokenId) => {
          const tokenURI = await contract.tokenURI(tokenId)
          let metadata = {}
          try {
            const response = await axios.get(tokenURI)
            metadata = response.data
          } catch (error) {
            console.error(`Error fetching metadata for token ${tokenId}: ${error}`)
          }

          return {
            tokenId,
            tokenURI,
            metadata,
          }
        }),
      )

      setNfts(tokenData)
    }

    fetchNfts()
  }, [account])

  return (
    <>
      <VStack divider={<StackDivider borderColor="gray" />} spacing={4} align="stretch" bg="#6a14fc" p={4} color="white">
        <Heading as="h4" size="md">
          Mint IBUNY
        </Heading>
        <Box p={8} w={'auto'} border="1px solid silver">
          <Text>Mint a IBUNY NFT!</Text>
          <Text>Create a NFT Proxy Account</Text>
          <Text noOfLines={2}>Create a NFT token bound account</Text>
        </Box>
        <MintIBUNY account={account} />
        <IBUNYDashboard />
      </VStack>
    </>
  )
}
