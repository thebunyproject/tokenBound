import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

const TBADescription = () => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md" bg='white' border='1px solid silver'>

      <Text>
        Token bound accounts allow any single NFT to become a fully functional crypto wallet. ERC6551 went live on the Ethereum Mainnet on May 7, 2023 and was
        created by the team at Future Primitive, the same team that brought us ERC-721 and CryptoKitties.
      </Text>
      <Text mt={4}>
        Token Bound Accounts (TBAs) are wallets that enable the creation of an interface and registry for smart contract accounts owned by ERC-721 tokens. They
        are directly linked to the NFTs that ‘own’ them.
      </Text>
      <Text mt={4}>
        TBA gives NFTs two new important properties. First, the ability to own on-chain assets - ERC721, ERC20, ERC1155. Second, the ability to participate in
        social governance, (ie. be a signer of a multisig, register ENS domains, vote on community proposals.
      </Text>
      <Text mt={4}>
        <Text mt={2}>
          <Text mt={4} as="b">
            The Underlying Mechanism of ERC-6551
          </Text>
        </Text>
        As mentioned, TBAs are smart contract wallets owned by a single ERC-721 NFT. The control, however, falls into the hands of the NFT holder. They have the
        power to execute on-chain actions through the TBA.
      </Text>
      <Text mt={2}>The mechanism of an ERC-6551 TBA can be broken up into 3 parts:</Text>
      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          1. The Registry:
        </Text>
        <Text>
          The Registry runs 2 functions crucial for the creation of the TBA: createAccount: deploys a brand new TBA for an ERC-721 using a specified
          implementation address. account: computes a TBA address for an existing ERC-721 token.
        </Text>
      </Text>
      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          2. Minimal Proxy Contracts
        </Text>
        <Text>
          Every TBA is then distributed to the world as an ERC-1167 minimal proxy (MPC), complete with immutable constant data tacked onto the bytecode. MPCs
          are used for two reasons: - Cheaper: Instead of deploying NFT contracts multiple times, you can simply clone contracts. - Less work: You will only
          need to deploy the proxy contract once.
        </Text>
      </Text>
      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          3. Account Interface
        </Text>
        <Text>
          Defines a set of functions currently available to the TBA → Defines the set of actions it can take. Allows limitations of the NFT owner’s ability to
          execute calls. This is crucial for security purposes as it may prevent unauthorized access to the TBA. On the flip side, the account interface
          provides a way to grant execution permissions to non-owner accounts. This is useful for multi-party TBAs.
        </Text>
      </Text>
      <Text mt={4}>The Registry, Proxy, and Account contracts of the ERC-6551 mechanism are what allows for it to act as a smart contract wallet.</Text>
      <Text mt={4} as="b">
        ERC6551 Use Cases
      </Text>

      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          Gaming
        </Text>
        - TBA enables the creation of in-game inventories for individual characters. Players can transfer all in-game assets to the character's wallet.
      </Text>
      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          Community Building
        </Text>
        - Add incentives for NFT communities, DAOs, NFT PFP, or membership cards.
      </Text>
      <Text ml={4} mt={2}>
        <Text mt={4} as="b">
          Membership & Loyalty Programs
        </Text>
        - Grant NFTs membership access, perks to loyalty programs. Use NFTs to lock/unlock exclusive content.
      </Text>
      <Text mt={4}>
      ERC-6551 built upon the foundations laid by ERC-721s, and implemented meaningful enhancements in functionality, ownership and interoperability. Although still experimental, what is clear is that ERC-6551 and token bound accounts will play a pivotal role in the evolution of NFTs.
      </Text>

    </Box>
  )
}

export default TBADescription
