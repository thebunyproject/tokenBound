import React, { useContext } from 'react'
import { Box, Text, VStack, Card, HStack } from '@chakra-ui/react'
import { useMetaMask } from '../../hooks/useMetamask'
import { formatChainAsNum } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext'
import { formatAddress } from '../../utils/formatMetamask'
import WhatNetworkName from './../../utils/WhatNetworkName'
import FetchAccountToken from '../Account/FetchAccountToken'

export const Display = () => {
  const { wallet } = useMetaMask()
  const { account, logged, accountAddress, signature, avatarImage } = useContext(AppContext)

  return (
    <Box marginTop="0px" minWidth={'100px'} w="100%">
      {wallet.accounts.length > 0 && (
        <Card padding="15px" borderTop="1px solid silver" backgroundColor="white" marginBottom="4px" borderRadius={0}>

          <VStack spacing="2px">
            {!accountAddress && (
              <>
                <Text>Balance: {wallet.balance} TLOS</Text>

                <Text>Wallet: {formatAddress(account)}</Text>
                <HStack>
                  <Text>({formatChainAsNum(wallet.chainId)})</Text>
                  <WhatNetworkName chainId={formatChainAsNum(wallet.chainId)} />
                </HStack>
              </>
            )}
            {accountAddress && signature && (
              <>
                <FetchAccountToken accountAddress={accountAddress} />
              </>
            )}
          </VStack>
        </Card>
      )}
    </Box>
  )
}
