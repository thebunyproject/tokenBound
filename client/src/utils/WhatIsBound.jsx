import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import BunyERC6551Registry from '../contracts/fuji/BunyERC6551Registry.json'
import { HStack, Text, Table, Thead, Tbody, Tr, Th, Td, Center } from '@chakra-ui/react'

function WhatIsBound({ accountAddress, onIsActive }) {
  const [isActive, setIsActive] = useState(false)
  const [implementation, setImplementation] = useState('')
  const [chainID, setChainID] = useState('')
  const [tokenContractAddress, setTokenContractAddress] = useState('')
  const [tokenID, setTokenID] = useState('')
  const [salt, setSalt] = useState('')

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setIsActive(false)
        const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
        const accountDetails = await registryContract.getAccountDetails(accountAddress)

        console.log('Checking for existing token bound account')
        setImplementation(accountDetails[0])
        setChainID(accountDetails[1].toString())
        setTokenContractAddress(accountDetails[2])

        const tokenIDBigNumber = ethers.BigNumber.from(accountDetails[3])
        setTokenID(tokenIDBigNumber.toString())

        if (tokenIDBigNumber.gte(1)) {
          setIsActive(true)
          onIsActive(true)
          console.log('Token Bound Account Found')
        }

        setSalt(accountDetails[4].toString())
      } catch (error) {
        console.error('Error checking account:', error)
      }
    }

    fetchAccountDetails(accountAddress)
  }, [accountAddress, onIsActive])

  return (
    <>
      
      <Table variant="simple" size={'sm'}>
      <Thead>
        <Tr>
          <Th>Property</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Token Bound?</Td>
          <Td>
            <Text h="auto" w="auto">
              {isActive.toString()}
            </Text>
          </Td>
        </Tr>
        {isActive && (
          <>
            <Tr>
              <Td>Implementation Address</Td>
              <Td>{implementation}</Td>
            </Tr>
            <Tr>
              <Td>Chain ID</Td>
              <Td>{chainID}</Td>
            </Tr>
            <Tr>
              <Td>Token Contract Address</Td>
              <Td>{tokenContractAddress}</Td>
            </Tr>
            <Tr>
              <Td>Token ID</Td>
              <Td>{tokenID && (<>{tokenID}</>)}</Td>
            </Tr>
            <Tr>
              <Td>Salt</Td>
              <Td>{salt}</Td>
            </Tr>
          </>
        )}
      </Tbody>
    </Table>
      
    </>
  )
}

export default WhatIsBound
