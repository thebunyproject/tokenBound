import React, { useContext, useState, useEffect } from 'react'
import { Box, TableContainer, Table, Tbody, Tr, Td, Text, HStack } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import WhatNetworkName from '../../utils/WhatNetworkName'
import { formatChainAsNum } from '../../utils/formatMetamask'
import FetchAccountAddress from '../FetchAccountAddress'
import WhatNFTOwner from '../../utils/WhatNFTOwner'

const NftLoginForm2 = ({ selectedNetwork, chainId, inputAddress, inputName,  nftSymbol, inputTokenId, handleAccountAddress, fetchNFTData }) => {
  const { account } = useContext(AppContext)
  const [accountAddress, setAccountAddress] = useState('')
  const [nftOwner, setNftOwner] = useState(null)
  const [isOwner, setIsOwner] = useState(false)


  useEffect(() => {
    fetchNFTData()
    console.log('fetching nft data')
  }, [fetchNFTData])

  const updateAccountAddress = (address) => {
    setAccountAddress(address)
    handleAccountAddress(address)
  }


  const handleNftOwner = (nftOwner) => {
    setNftOwner(nftOwner)
  }

  
  const handleIsOwner = (isOwner) => {
    setIsOwner(isOwner)
  }

  

  return (
    <Box fontSize='12px'>
      <TableContainer p={4}>
        <Table variant='simple' size="auto" p={2}>
          <Tbody bg="#6a14fc" textAlign={'left'} width="100%">
            <Tr>
              <Td as="b" mr={2} >
                Name:
              </Td>
              <Td>{inputName && (<>{inputName}</>)}</Td>
            </Tr>

            <Tr>
              <Td as="b" mr={2} >
                Token Id
              </Td>
              <Td>
                <HStack>
                  <Text>{inputTokenId && (<>{inputTokenId.toString()}</>)}</Text>
                  <Text>{nftSymbol}</Text>
                </HStack>
              </Td>
            </Tr>

            <Tr>
              <Td as="b" mr={2} >
                Network:{' '}
              </Td>
              <Td>
                <HStack>
                  <WhatNetworkName chainId={formatChainAsNum(chainId)} />
                  <Text>({chainId && (<>{chainId.toString()}</>)})</Text>
                </HStack>
              </Td>
            </Tr>
            <Tr>
              <Td as="b" mr={2} >
                isOwner
              </Td>
              <Td>
              
              <WhatNFTOwner onNftOwner={handleNftOwner}  onIsOwner={handleIsOwner} inputAddress={inputAddress} inputChainId={chainId} inputTokenId={inputTokenId} />

 

              </Td>
            </Tr>
            <Tr>
              <Td as="b" mr={2} >
                NFT
              </Td>
              <Td>{inputAddress && (<>{inputAddress}</>)}</Td>
            </Tr>

            <Tr>
              <Td as="b" mr={2} >
                Owner
              </Td>
              <Td>
{nftOwner && (<><Text>{nftOwner}</Text></>)}
              </Td>
            </Tr>

            <Tr>
              <Td as="b" mr={2} >
                Account
              </Td>
              <Td>

              <FetchAccountAddress onAccountAddress={updateAccountAddress} inputTokenId={inputTokenId} inputAddress={inputAddress} inputChainId={chainId} />
              </Td>
            </Tr>
   

           
          </Tbody>
        </Table>
      </TableContainer>
      

    

    </Box>
  )
}

export default NftLoginForm2
