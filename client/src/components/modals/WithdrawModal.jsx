import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'
import { Button } from 'antd'

const WithdrawModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
            <Button size='small' type="default" onClick={onOpen}>

        <div style={{ fontSize: '12px', paddingLeft: '4px' }}>Withdraw</div>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Withdraw </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <div> Withdraw Form</div>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WithdrawModal
