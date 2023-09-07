import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { Grid, GridItem, useClipboard, Box, Image, Center, Text, Button, HStack, Divider, VStack, Heading } from '@chakra-ui/react'
import BunyERC6551Account from '../contracts/fuji/BunyERC6551Account.json'
import BunyERC6551Registry from '../contracts/fuji/BunyERC6551Registry.json'
import TheBUNY from '../contracts/fuji/TheBUNY.json'
import FetchAccountToken from './FetchAccountToken'

function IBUNYDashboard({ account, onAvatarImageChange, onAvatarNameChange }) {
  const [nfts, setNfts] = useState([])
  const [accountAddress, setAccountAddress] = useState('')
  const [tokenId, setTokenId] = useState()
  const [chainId, setChainId] = useState()
  const [accountName, setAccountName] = useState('')

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountAddress)
  }

  // Select NFT and create ERC6551 token bound account
  const createAccount = async (tokenId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const implementation = BunyERC6551Account.address
    const chainId = 43113
    const salt = 1 // or some other unique number
    const initData = '0x' // no init data
    const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
    const create = await registryContract.createAccount(implementation, chainId, TheBUNY.address, tokenId, salt, initData)
    console.log(create)
    //const accountAddress = await registryContract.account(implementation, chainId, TheBUNY.address, tokenId, salt)
    //setAccountAddress(accountAddress)
  }


  const [nftError, setNftError] = useState()

  // Fetch all user owned IBUNY tokens
  useEffect(() => {
    async function fetchNfts() {
      // Use MetaMask's provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, provider)

      // Get the current user's address
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()

      // Fetch owned NFTs
      const ownedNFTs = await contract.tokensOfOwner(userAddress)
      if (ownedNFTs.length === 0) {
        console.log('No NFTs found.')
        setNftError('No NFTs found')
        return // Return early if no NFTs are found
      }
      // Fetch tokenURIs and metadata of each NFT
      const tokenData = await Promise.all(
        ownedNFTs.map(async (tokenId) => {
          const tokenURI = await contract.tokenURI(tokenId)

          // Fetch metadata using axios
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
    <Box p={1} fontSize="12px">
      <div>
        {accountAddress && (
          <>
            <Heading as="h5" color="#838a9c">
              {accountName}
            </Heading>

            <FetchAccountToken tokenId={tokenId} accountAddress={accountAddress} chainId={chainId} handleCopyAccount={handleCopyAccount} />
          </>
        )}
      </div>
      <div>
        {!account && (
          <>
            {nfts && (
              <>
                <Text fontSize="x2" fontWeight="bold" mb={2}>
                  My IBUNY NFTs
                </Text>
              </>
            )}
            <Grid
              bg="white"
              color="black"
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(3, 1fr)' }}
              gap={3}>
              {nfts.map((nft, i) => (
                <GridItem key={i}>
                  <Center p={2}>
                    <VStack>
                      <Text fontSize={'12px'}> {nft.metadata.name}</Text>
                      <Box border="1px solid #c1cfd8" p={4}>
                        <Image boxSize="180px" objectFit="cover" src={nft.metadata.image} alt={nft.metadata.name} />
                        <Text mb={4} noOfLines={3} overflow={'hidden'} fontSize={'12px'}>
                          {' '}
                          {nft.metadata.description}
                        </Text>
                        <Button variant={'outline'} colorScheme="twitter" block mt={2} onClick={() => createAccount(nft.tokenId)}>
                          Load NFT
                        </Button>
                      </Box>
                    </VStack>
                  </Center>
                </GridItem>
              ))}
            </Grid>
          </>
        )}
      </div>
    </Box>
  )
}

export default IBUNYDashboard
