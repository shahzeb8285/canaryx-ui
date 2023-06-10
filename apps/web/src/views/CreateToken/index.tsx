import styled from 'styled-components'
import {
  Button,
  Heading,
  Flex,
  PageHeader,
  PageSection,
  Input,
  Box,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SecondaryLabel, FormError } from 'views/Voting/CreateProposal/styles'
import { useState } from 'react'

import { useCreateToken } from './hooks/useCreateToken'


const StyledHeader = styled(PageHeader)`
  max-height: max-content;
  margin-bottom: -40px;
  padding-bottom: 40px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const Left = styled(Flex)`
  flex-direction: column;
  flex: 1;
`

const Right = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex: 0.5;
  & img {
    height: 50%;
    width: 50%;
    max-height: 330px;
    margin-top: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & img {
      height: auto;
      width: auto;
    }
  }
`

const AuctionContainer = styled(Flex)`
  width: 100%;
  align-items: flex-start;

  ${({ theme }) => theme.mediaQueries.md} {
    gap: 24px;
  }
`

const CreateToken = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { address: account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: 0,
    mintable: false,
    burnable: false

  })

  const [deployedContractAddress, setDeployedContractAddress] = useState("")

  const { handleCreate } = useCreateToken()


  const [formError, setFormError] = useState({
    tokenNameError: "",
    tokenSymbolError: "",
    tokenSupplyError: "",

  })




  const validate = () => {
    console.log("Ssc validate")
    let isError = false;
    let errors = {
      tokenNameError: "",
      tokenSymbolError: "",
      tokenSupplyError: "",

    }
    if (!formData.tokenName) {
      errors = {
        ...errors,
        tokenNameError: "Enter Valid Token Name"
      }

      isError = true
    }


    if (!formData.tokenSymbol) {

      errors = {
        ...errors,
        tokenSymbolError: "Enter Valid Token Symbol"
      }
      isError = true
    }
    if (formData.tokenSupply === 0) {

      errors = {
        ...errors,
        tokenSupplyError: "Enter Valid Token Supply"
      }
      isError = true
    }

    setFormError(errors)

    return !isError
  }


  const handleSubmit = async () => {
    const isValid = validate()
    setIsLoading(true)
    if (isValid) {


      try {
        const receipt = await handleCreate(formData.tokenName,
          formData.tokenSymbol, formData.tokenSupply,
          formData.mintable,
          formData.burnable)
        const contractAddress = receipt.logs[0].address
        setDeployedContractAddress(contractAddress)
      } catch (err) {
        console.error(err)
      }
    }

    setIsLoading(false)


  }


  return (
    <>
      <StyledHeader>

        <Flex flexDirection={['column-reverse', null, 'row']}>
          <Left>
            <Heading as="h1" scale="xxl" my="24px">
              Create Your Token
            </Heading>
          </Left>

        </Flex>
      </StyledHeader>
      <>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.background}
          p="24px 0"
          index={2}
          concaveDivider
          dividerPosition="top"
        >
          <AppBody>
            <Box>
              <Card>
                <CardHeader>
                  <Heading as="h3" scale="md">
                    Token Creation Form
                  </Heading>
                </CardHeader>
                <CardBody>

                  <Box mb="24px">
                    <SecondaryLabel>Enter Token Name</SecondaryLabel>
                    <Input
                      onChange={(e) => setFormData({
                        ...formData,
                        tokenName: e.target.value
                      })}
                      value={formData.tokenName}
                      placeholder="i.e Canary Token"
                    />
                    <FormError>{formError.tokenNameError}</FormError>

                  </Box>

                  <Box mb="24px">
                    <SecondaryLabel>Enter Token Symbol</SecondaryLabel>
                    <Input
                      onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
                      value={formData.tokenSymbol}
                      // onChange={handleDateChange('startTime')}
                      // selected={startTime}
                      placeholder="i.e CANARY"
                    />
                    <FormError>{formError.tokenSymbolError}</FormError>

                  </Box>

                  <Box mb="24px">
                    <SecondaryLabel>Enter Token Supply</SecondaryLabel>
                    <Input
                      type='number'
                      onChange={(e) => setFormData({ ...formData, tokenSupply: Number(e.target.value) })}
                      value={formData.tokenSupply.toString()}
                      // onChange={handleDateChange('startTime')}
                      placeholder="i.e 100000"
                    />
                    <FormError>{formError.tokenSupplyError}</FormError>

                  </Box>

                  <Box mb="24px" display="flex" >
                    <Box width="100%">
                      <SecondaryLabel >Mintable?</SecondaryLabel>
                      <Checkbox
                        checked={formData.mintable}
                        onChange={(e) => setFormData({ ...formData, mintable: !formData.mintable })}

                      />

                    </Box>
                    <Box width="100%">
                      <SecondaryLabel>Burnable?</SecondaryLabel>
                      <Checkbox checked={formData.burnable}
                        onChange={(e) => setFormData({ ...formData, burnable: !formData.burnable })}
                      />
                    </Box>
                  </Box>
                  {account ? (
                    <>
                      <Button
                        type="submit"
                        width="100%"
                        isLoading={isLoading}
                        onClick={(e) => {
                          e.preventDefault()
                          handleSubmit()

                        }}
                        mb="16px"
                      >
                        Create Token
                      </Button>



                      <SecondaryLabel>Token Address:
                        <a href={`https://songbird-explorer.flare.network/address/${deployedContractAddress}/contracts`}
                          rel="noreferrer"
                          target='_blank'>
                          {deployedContractAddress}
                        </a>
                      </SecondaryLabel>


                    </>
                  ) : (
                    <ConnectWalletButton width="100%" type="button" />
                  )}
                </CardBody>
              </Card>
            </Box>
          </AppBody>
        </PageSection>

      </>
    </>
  )
}

export default CreateToken
