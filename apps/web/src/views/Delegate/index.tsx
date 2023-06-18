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
  Link,
  FlexLayout,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SecondaryLabel, FormError } from 'views/Voting/CreateProposal/styles'
import { useEffect, useState } from 'react'

import { useCreateToken } from './hooks/useCreateToken'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'

import { formatEther, parseUnits } from '@ethersproject/units'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getContract } from 'utils/contractHelpers'
import { useContract } from 'hooks/useContract'
import WSGBABI from "config/abi/wsgb.json";
import ftsoABI from "config/abi/ftsoABI.json";

import { PercentSlider } from '@pancakeswap/uikit/src/widgets/Liquidity'
import FlexRow from 'views/Predictions/components/FlexRow'
import { AtomBox } from '@pancakeswap/ui'

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


const CreateToken = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { address: account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    delegationAmount: 0,

  })
  const wbnbAddress = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";
  const DELEGATION_ADDRESS = "0x69141E890F3a79cd2CFf552c0B71508bE23712dC";
  const { balance: bnbBalance, } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  const { balance: wbnbBalance, } = useTokenBalance(wbnbAddress)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)
  const wsgbContract = useContract(wbnbAddress, WSGBABI, true);

  const ftsoAddress = "0x13F7866568dC476cC3522d17C23C35FEDc1431C5"
  const ftsoContract = useContract(ftsoAddress, ftsoABI, true);

  const [pendingReward, setPendingReward] = useState("")


  const [formError, setFormError] = useState({
    wgbDelegationError: "",
  })


  useEffect(() => {
    if (ftsoContract && account) {
        loadMyData()
    }
  },[ftsoContract,account])


  const loadMyData = async() => {
    try {
      const _pendingReward = await ftsoContract.callStatic.claim(account, account, "90", false);
      const formattedReward = Number(formatEther(_pendingReward)).toFixed(4)
      setPendingReward(formattedReward)
    } catch (err) {
      
   }
  }


  const validate = () => {
    let isError = false;
    let errors = {
      wgbDelegationError: ""
    }
    if (!formData.delegationAmount) {
      errors = {
        ...errors,
        wgbDelegationError: "Enter Valid Delegation Amount"
      }
      isError = true
    } else {
      const pipsRaw = formData.delegationAmount * 10000 / formattedWbnbBalance
      if (pipsRaw > 10000) {
        errors = {
          ...errors,
          wgbDelegationError: "Not Enough WSGB Balance"
        }
        isError = true
      }
    }

    setFormError(errors)

    return !isError
  }


  const handleClaim = async () => {
    setIsLoading(true)
    try {
      
      await ftsoContract.claim(account,account,"90",false);

    } catch (err) {
      
    }
    setIsLoading(false)

  }


  const unDelegate = async () => {
    setIsLoading(true)
    try {
      await wsgbContract.undelegateAll();
    } catch (err) {
      
    }
    setIsLoading(false)

  }
  

  const handleSubmit = async () => {
    const isValid = validate()
    setIsLoading(true)
    if (isValid) {

      try {
        const pipsRaw = formData.delegationAmount * 10000 / formattedWbnbBalance
        const pips = parseInt(pipsRaw.toString());
        await wsgbContract.delegate(DELEGATION_ADDRESS, pips);
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
              Delegate Your WSGB
            </Heading>
          </Left>

        </Flex>
      </StyledHeader>
      <>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%', } }}
          background={theme.colors.background}
          // p="24px 0"
          index={2}
          concaveDivider
          dividerPosition="top"
        >
          <AppBody >
            <Box width="100%"
              style={{
                // background: "red",
                width: "100%",
                display: "flex"
              }} className='testtest'
            >
              <Card style={{
                width: "100%"
              }}>
                <CardHeader>
                  <Heading as="h3" scale="md">
                    SGB Delegation
                  </Heading>
                </CardHeader>

                <CardBody>


                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ width: "80%" }}>
                      <Box mb="24px">
                        <SecondaryLabel>SGB Balance:</SecondaryLabel>
                        <Input
                          disabled

                          value={formattedBnbBalance}
                          placeholder="0"
                        />

                      </Box>

                      <Box mb="24px">
                        <SecondaryLabel>WSGB Balance:</SecondaryLabel>
                        <Input
                          disabled
                          value={formattedWbnbBalance}
                          placeholder="0"
                        />
                        <Link
                          external
                          m="0 4px"
                          fontSize="12px"
                          color="warning"
                          href={"/swap?chain=songbird&outputCurrency=0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED"}
                          style={{ textDecoration: 'underline' }}
                        >
                          Convert SGB To WSGB
                        </Link>
                      </Box>

                      <Box mb="24px">
                        <SecondaryLabel>Enter WSGB Delegation Amount</SecondaryLabel>
                        <Input
                          type='number'

                          onChange={(e) => setFormData({ ...formData, delegationAmount: Number(e.target.value) })}
                          value={formData.delegationAmount.toString()}
                          // onChange={handleDateChange('startTime')}
                          placeholder="i.e 100000"
                        />

                        <PercentSlider

                          onValueChanged={(e) => {
                            const _inputAmount = formattedWbnbBalance * Number(e) / 100;
                            setFormData({ ...formData, delegationAmount: Number(_inputAmount) })
                          }}
                          currentValue={formData.delegationAmount * 100 / formattedWbnbBalance}
                        />
                        <FormError>{formError.wgbDelegationError}</FormError>

                      </Box>


                      {account && (
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
                            Delegate
                          </Button>




                        </>
                      )}

                    </div>

                    <div style={{ width: "100%", marginLeft: 10 }}>
                      {/* <Box mb="24px">
                        <SecondaryLabel>Delegated WSGB Balance:</SecondaryLabel>
                        <Input
                          disabled

                          value={formattedBnbBalance}
                          placeholder="0"
                        />

                      </Box> */}

                      {account && <div>

                        <Button
                          type="submit"
                          width="100%"
                          isLoading={isLoading}
                          onClick={(e) => {
                            e.preventDefault()
                            unDelegate()
                          }}
                          mb="16px"
                        >
                          Undelegate All
                        </Button>




                       <Button
                          type="submit"
                          width="100%"
                          disabled={isNaN(Number(pendingReward))}
                          isLoading={isLoading}
                          onClick={(e) => {
                            e.preventDefault()
                            handleClaim()
                          }}
                          mb="16px"
                        >
                          Claim {pendingReward && pendingReward} SGB Reward
                        </Button>

                      </div>}



                    </div>


                  </div>

                  {!account && <ConnectWalletButton width="100%" type="button" />}
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
