import React from 'react'
import { Box, Text, VStack, HStack, FormControl, FormLabel, Select, Input, Wrap, WrapItem } from '@chakra-ui/react'
import TelosNftSelect from '../../config/TelosNftSelection'
import EthNftSelect from '../../config/EthNftSelection'
import TelosTestnetNftSelect from '../../config/TelosTestnetNftSelection'
import PolygonNftSelection from '../../config/PolygonNftSelection'

// And other component imports...
import FujiNftSelection from './../../config/FujiNftSelection'
import WhatNetworkName from '../../utils/WhatNetworkName'
import { formatChainAsNum } from '../../utils/formatMetamask'
import WhatCollectionName from '../../utils/WhatCollectionName'
import AvaxNftSelection from '../../config/AvaxNftSelection'

const NftLoginForm = ({
  accountAddress,
  selectedChainId,
  options,
  inputAddress,
  inputTokenId,
  handleChange,
  handleCollectionChange,
  onInputAddressChange,
  onInputTokenIdChange,
}) => {
  // Define states and functions here...

  return (
    <>
      <div>
        {!accountAddress && (
          <>
            <FormControl w="100%" p={6}>
              <FormLabel fontSize="small" mt={2} mb={1}>
                <HStack gap="4px" m={1}>
                  <Text>Source Network:</Text>
                  <WhatNetworkName chainId={formatChainAsNum(selectedChainId)} />
                </HStack>
              </FormLabel>
              <Select
                size="sm"
                variant={'flushed'}
                value={selectedChainId}
                onChange={handleChange}
                w="100%"
                placeholder="Select Network"
                color="black"
                bg="white">
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <FormLabel fontSize="small" mt={2} mb={1}>
                {inputAddress && (
                  <>
                    <HStack>
                      <Text textAlign={'left'}>Collection:</Text>
                      <Text fontSize={'sm'}>
                      <WhatCollectionName inputAddress={inputAddress} inputChainId={selectedChainId} />
                      </Text>
                    </HStack>
                  </>
                )}
              </FormLabel>
              <Box backgroundColor="white" color="black">
                <>{selectedChainId === '40' ? <TelosNftSelect onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
                <>{selectedChainId === '1' ? <EthNftSelect onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
                <>{selectedChainId === '41' ? <TelosTestnetNftSelect onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
                <>{selectedChainId === '137' ? <PolygonNftSelection onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
                <>{selectedChainId === '43113' ? <FujiNftSelection onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
                <>{selectedChainId === '43114' ? <AvaxNftSelection onCollectionChange={handleCollectionChange} w="100%" /> : null}</>
              </Box>
              
                <HStack gap="13px" w="auto" textAlign={'left'} mt={2}>
                <Wrap>
                  <WrapItem>
                    <VStack>
                      <FormLabel fontSize="small" mb={-2}>
                        <Text textAlign={'left'}>Contract</Text>
                      </FormLabel>
                      <Input
                        variant={'outline'}
                        size="sm"
                        backgroundColor={'white'}
                        color="black"
                        type="text"
                        value={inputAddress}
                        onChange={onInputAddressChange}
                        placeholder="Input or Select NFT collection address"
                        //minWidth={'300px'}
                        w="100%"
                      />{' '}
                    </VStack>
                  </WrapItem>

                  <WrapItem>
                    <VStack>
                      <FormLabel fontSize="small" mb={-2}>
                        <Text textAlign={'left'}>Token ID</Text>
                      </FormLabel>
                      <Input
                        variant={'outline'}
                        size="sm"
                        backgroundColor={'white'}
                        color="black"
                        type="number"
                        w="60px"
                        value={inputTokenId}
                        onChange={onInputTokenIdChange}
                      />
                    </VStack>
                  </WrapItem>
                  </Wrap>
                </HStack>

            </FormControl>
          </>
        )}
      </div>
    </>
  )
}

export default NftLoginForm
