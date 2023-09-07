import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Button as AntButton } from 'antd'
import { Box, HStack, Center, useToast, Spinner } from '@chakra-ui/react'
import TheBUNY from '../../contracts/fuji/TheBUNY.json'
import axios from 'axios'
import { VStack, Image, Button, Text } from '@chakra-ui/react'
//import { formatAddress } from '../../utils/formatMetamask'


function MintIBUNY({ account }) {
  const [nftName, setNftName] = useState()
  const [nftSymbol, setNftSymbol] = useState()
  const [maxSupply, setMaxSupply] = useState()
  const [nftCost, setCost] = useState(null)
  const [tokenCount, setTokenCount] = useState()
  const nftAddress = TheBUNY.address
  const [mintResult, setMintResult] = useState()
  const toast = useToast()
  const [IBUNYImage, setIBUNYImage] = useState()
  const [isLoading, setIsLoading] = useState(false)


  const fetchIBUNYData = useCallback(async () => {
    setIsLoading(true)
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
    const nftContract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, provider)
    const name = await nftContract.name()
    setNftName(name)
    const price = await nftContract.cost()
    setCost(ethers.utils.formatUnits(price, 'ether'))
    const symbol = await nftContract.symbol()
    setNftSymbol(symbol)
    const tokenCount = await nftContract.totalSupply()
    setTokenCount(tokenCount.toString())
    const max = await nftContract.maxSupply()
    setMaxSupply(max.toString())
    const baseURI = await nftContract.baseURI()
    //setBaseURI(baseURI.toString())
    console.log(baseURI.toString())
    const tokenURI = await nftContract.tokenURI(tokenCount.toString())
    console.log(tokenURI)
    const call = await axios.get(tokenURI)
    console.log(JSON.stringify(call.data.image))
    setIBUNYImage(call.data.image)
    setIsLoading(false)
  }, []) // Update the dependencies as needed

  useEffect(() => {
    if (window.ethereum) {
      fetchIBUNYData()
    } else {
      console.log('Please install MetaMask')
    }
  }, [])

  const mintIBUNY = async () => {
    try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, signer)
    const contractWithSigner = contract.connect(signer)
    const price = await contract.cost()
    const result = await contractWithSigner.mint('1', {
      value: price,
    })
    console.log(result)
    setMintResult(result.hash.toString())
    toast({
      title: 'Transaction successful',
      description: `IBUNY Successfully minted! Reload page to continue. Transaction hash: ${result.hash}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  } catch (error) {
    toast({
      title: 'Transaction failed',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }}

  return (
    <VStack bg='white' color='black' spacing={1} w={'100%'} p={1} mt={1}>
      
      <style jsx>{`
        p {
          font-size: 12px;
        }
      `}</style>
      {isLoading ? (

        <Center p={12} w="100%" h="100%">
        <Spinner size={'lg'} color="#b77672" />
        </Center>
        ) : (
          <>
        <HStack m={1}>
          <Text as="b">Name:</Text>
          <Text bg="ghostwhite" p={1} noOfLines={1} overflow={'hidden'}> {nftName}</Text>
        </HStack>
        
          <Text bg="ghostwhite" p={1} noOfLines={1} overflow={'hidden'}> 
          {nftAddress}
          </Text>
        <div>
          <>
            
              <div>
                <Center mt={2} >
                  <VStack w="100%">
                    <Image src={IBUNYImage} width="200px" border="1px solid silver" />
                    <Text fontSize="10px">
                      * NFT image is the most recent NFT to be minted. 
                    </Text>

                    <div>
                      {mintResult && (
                        <>
                          <Box mb={2}>
                            <AntButton href={`https://testnet.teloscan.io/tx/${mintResult}`} target="_blank" >
                              View Transaction
                            </AntButton>
                            </Box>
                            
                        </>
                      )}
                    </div>
                  </VStack>
                </Center>
              </div>
            
          </>
        </div>
</>
        )}
      
        
      
      <Button size={'sm'}  colorScheme='twitter'  onClick={() => mintIBUNY('1')}>
        <HStack fontSize="12px">
          {' '}
          <Text>Mint </Text>
          <Text> {nftSymbol}</Text>
          <Text>{nftCost}/AVAX</Text>
        </HStack>
      </Button>
    </VStack>
  )
}

export default MintIBUNY
